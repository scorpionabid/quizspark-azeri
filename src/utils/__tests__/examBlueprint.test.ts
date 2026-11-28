import { describe, it, expect } from 'vitest';
import {
  summarizeBankByTopics,
  assembleExamFromBlueprint,
  findSwapCandidate,
} from '@/utils/examBlueprint';
import { parseMarkdownFull } from '@/utils/parsers/markdown-parser';
import { formatQuestionsToMarkdown } from '@/components/question-bank/import-export/utils';
import type { QuestionBankItem } from '@/hooks/useQuestionBank';

function makeBankItem(overrides: Partial<QuestionBankItem>): QuestionBankItem {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    question_text: overrides.question_text ?? 'Nümunə sual?',
    question_type: overrides.question_type ?? 'multiple_choice',
    options: overrides.options ?? ['A variantı', 'B variantı', 'C variantı', 'D variantı'],
    correct_answer: overrides.correct_answer ?? 'A variantı',
    explanation: overrides.explanation ?? null,
    category: overrides.category ?? null,
    difficulty: overrides.difficulty ?? 'orta',
    bloom_level: overrides.bloom_level ?? null,
    tags: overrides.tags ?? null,
    user_id: null,
    source_document_id: null,
    created_at: '2026-11-28T00:00:00Z',
    updated_at: '2026-11-28T00:00:00Z',
    question_image_url: null,
    option_images: null,
    media_type: null,
    media_url: null,
    title: null,
    weight: overrides.weight ?? 5,
    hint: null,
    time_limit: null,
    per_option_explanations: null,
    video_url: null,
    video_start_time: null,
    video_end_time: null,
    model_3d_url: null,
    model_3d_type: null,
    hotspot_data: null,
    matching_pairs: null,
    sequence_items: null,
    fill_blank_template: null,
    numerical_answer: null,
    numerical_tolerance: null,
    correct_option_indices: null,
    feedback_enabled: null,
    quality_score: null,
    usage_count: null,
    subject: overrides.subject ?? 'Təbiət',
    grade: overrides.grade ?? '6-cı sinif',
    topic: overrides.topic ?? '4.2 Yoluxucu xəstəliklər',
    curriculum_standard: overrides.curriculum_standard ?? '6-4.2.1',
    difficulty_level: overrides.difficulty_level ?? 'II',
    essay_rubric: overrides.essay_rubric ?? null,
    sample_answer: overrides.sample_answer ?? null,
    answer_lines: overrides.answer_lines ?? null,
  };
}

describe('examBlueprint engine', () => {
  const sampleBank: QuestionBankItem[] = [
    makeBankItem({ id: 'q1', topic: 'Mövzu A', difficulty_level: 'I', difficulty: 'asan', weight: 5, curriculum_standard: '6-1.1' }),
    makeBankItem({ id: 'q2', topic: 'Mövzu A', difficulty_level: 'II', difficulty: 'orta', weight: 10, curriculum_standard: '6-1.1' }),
    makeBankItem({ id: 'q3', topic: 'Mövzu A', difficulty_level: 'III', difficulty: 'orta', weight: 15, curriculum_standard: '6-1.2' }),
    makeBankItem({ id: 'q4', topic: 'Mövzu A', difficulty_level: 'IV', difficulty: 'çətin', weight: 20, curriculum_standard: '6-1.2' }),
    makeBankItem({ id: 'q5', topic: 'Mövzu B', difficulty_level: 'I', difficulty: 'asan', weight: 5, curriculum_standard: '6-2.1' }),
    makeBankItem({ id: 'q6', topic: 'Mövzu B', difficulty_level: 'III', difficulty: 'çətin', weight: 15, curriculum_standard: '6-2.1' }),
  ];

  it('summarizes bank questions by topic, standards, and I–IV levels', () => {
    const stats = summarizeBankByTopics(sampleBank);
    expect(stats).toHaveLength(2);
    const topicA = stats.find((s) => s.topic === 'Mövzu A')!;
    expect(topicA.count).toBe(4);
    expect(topicA.standards).toEqual(['6-1.1', '6-1.2']);
    expect(topicA.levelCounts).toEqual({ I: 1, II: 1, III: 1, IV: 1 });
    expect(topicA.avgWeight).toBe(12.5);
  });

  it('assembles requested counts per topic with custom points or bank weights and reports shortfalls', () => {
    const { questions, shortfalls } = assembleExamFromBlueprint(
      sampleBank,
      [
        { topic: 'Mövzu A', count: 3, pointsPerQuestion: 10, useBankWeight: false, difficultyFilter: 'balanced' },
        { topic: 'Mövzu B', count: 4, pointsPerQuestion: 5, useBankWeight: true, difficultyFilter: 'all' },
      ],
      42
    );

    // 3 from Topic A + 2 available from Topic B = 5
    expect(questions).toHaveLength(5);
    const topicAQs = questions.filter((q) => q.topic === 'Mövzu A');
    const topicBQs = questions.filter((q) => q.topic === 'Mövzu B');
    expect(topicAQs).toHaveLength(3);
    expect(topicAQs.every((q) => q.weight === 10)).toBe(true);
    expect(topicBQs).toHaveLength(2);
    expect(topicBQs.map((q) => q.weight).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([5, 15]);

    // Shortfall of 2 for Topic B
    expect(shortfalls).toHaveLength(1);
    expect(shortfalls[0].topic).toBe('Mövzu B');
    expect(shortfalls[0].missingCount).toBe(2);
  });

  it('finds an unused swap candidate from the same topic', () => {
    const used = new Set(['q1', 'q2', 'q3']);
    const candidate = findSwapCandidate(
      sampleBank,
      { question_text: '...', question_type: 'multiple_choice', correct_answer: 'A', topic: 'Mövzu A' },
      used
    );
    expect(candidate?.id).toBe('q4');
  });
});

describe('Markdown curriculum metadata parsing & round-trip export', () => {
  it('parses file-level frontmatter defaults and per-question overrides', () => {
    const md = `---
Fənn: Təbiət
Sinif: 6-cı sinif
Mövzu: 4.2 Yoluxucu xəstəliklər
Standart: 6-4.2.1
---

# İmmunitetin əsas rolu nədir?
A) Həzm
B) Müdafiə
C) Tənəffüs
D) İfrazat

Cavab: B
**Səviyyə:** I
**Çəki:** 5

---

# Peyvəndin təsir mexanizmini izah edin.
Cavab: Zəiflədilmiş patogenlə yaddaş hüceyrələri yaradır
Standart: 6-4.2.2
Səviyyə: IV
Bal: 20
Meyarlar: a) Yaddaş hüceyrələri izah olunur: 10 bal ; b) Nümunə verilir: 10 bal
Nümunə cavab: Peyvənd $\\frac{1}{100}$ doza ilə immunitet formalaşdırır.
Sətir: 6`;

    const result = parseMarkdownFull(md);
    expect(result.questions).toHaveLength(2);

    const [q1, q2] = result.questions;
    expect(q1.subject).toBe('Təbiət');
    expect(q1.grade).toBe('6-cı sinif');
    expect(q1.topic).toBe('4.2 Yoluxucu xəstəliklər');
    expect(q1.curriculum_standard).toBe('6-4.2.1');
    expect(q1.difficulty_level).toBe('I');
    expect(q1.weight).toBe(5);

    expect(q2.subject).toBe('Təbiət');
    expect(q2.curriculum_standard).toBe('6-4.2.2');
    expect(q2.difficulty_level).toBe('IV');
    expect(q2.weight).toBe(20);
    expect(q2.essay_rubric).toEqual([
      'a) Yaddaş hüceyrələri izah olunur: 10 bal',
      'b) Nümunə verilir: 10 bal',
    ]);
    expect(q2.sample_answer).toContain('\\frac{1}{100}');
    expect(q2.answer_lines).toBe(6);
  });

  it('round-trips questions through formatQuestionsToMarkdown and parseMarkdownFull', () => {
    const items: QuestionBankItem[] = [
      makeBankItem({
        id: 'rt1',
        question_text: '600-ün 20%-i neçədir?',
        options: ['100', '120', '140', '150'],
        correct_answer: '120',
        subject: 'Riyaziyyat',
        grade: '6-cı sinif',
        topic: 'Faiz məsələləri',
        curriculum_standard: '6-1.3.2',
        difficulty_level: 'II',
        difficulty: 'orta',
        weight: 10,
      }),
    ];

    const exportedMd = formatQuestionsToMarkdown(items);
    expect(exportedMd).toContain('Fənn: Riyaziyyat');
    expect(exportedMd).toContain('Sinif: 6-cı sinif');
    expect(exportedMd).toContain('Standart: 6-1.3.2');
    expect(exportedMd).toContain('Çəki: 10');

    const reparsed = parseMarkdownFull(exportedMd);
    expect(reparsed.questions).toHaveLength(1);
    expect(reparsed.questions[0].subject).toBe('Riyaziyyat');
    expect(reparsed.questions[0].grade).toBe('6-cı sinif');
    expect(reparsed.questions[0].topic).toBe('Faiz məsələləri');
    expect(reparsed.questions[0].curriculum_standard).toBe('6-1.3.2');
    expect(reparsed.questions[0].difficulty_level).toBe('II');
    expect(reparsed.questions[0].weight).toBe(10);
    expect(reparsed.questions[0].correct_answer).toBe('120');
  });
});
