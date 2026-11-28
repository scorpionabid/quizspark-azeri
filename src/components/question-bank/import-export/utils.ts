import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { PreviewQuestion } from '@/utils/parsers/types';

// ─── File download ───────────────────────────────────────────────────────────

export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── CSV helpers ─────────────────────────────────────────────────────────────

export function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n'))
    return `"${value.replace(/"/g, '""')}"`;
  return value;
}

// ─── Import formatting ───────────────────────────────────────────────────────

export function formatQuestionsForImport(
  preview: PreviewQuestion[],
): Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[] {
  return preview.map((q) => ({
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation ?? null,
    category: q.category ?? null,
    difficulty: q.difficulty ?? null,
    bloom_level: q.bloom_level ?? null,
    tags: q.tags ?? null,
    title: q.title ?? null,
    user_id: null,
    source_document_id: null,
    question_image_url: q.question_image_url ?? null,
    option_images: q.option_images ?? null,
    media_type: null as 'image' | 'audio' | 'video' | null,
    media_url: null,
    weight: q.weight ?? null,
    hint: q.hint ?? null,
    time_limit: null,
    per_option_explanations: q.per_option_explanations ?? null,
    video_url: null,
    video_start_time: null,
    video_end_time: null,
    model_3d_url: null,
    model_3d_type: null,
    hotspot_data: null,
    matching_pairs: q.matching_pairs ?? null,
    sequence_items: q.sequence_items ?? null,
    fill_blank_template: q.fill_blank_template ?? null,
    numerical_answer: q.numerical_answer ?? null,
    numerical_tolerance: q.numerical_tolerance ?? null,
    correct_option_indices:
      q.question_type === 'multiple_select' && Array.isArray(q.options) && q.correct_answer
        ? q.correct_answer.split(',').reduce<number[]>((acc, ca) => {
            const idx = (q.options as string[]).findIndex(
              (opt) => opt.trim() === ca.trim(),
            );
            if (idx >= 0) acc.push(idx);
            return acc;
          }, [])
        : null,
    feedback_enabled: null,
    quality_score: null,
    usage_count: null,
    subject: q.subject ?? null,
    grade: q.grade ?? null,
    topic: q.topic ?? null,
    curriculum_standard: q.curriculum_standard ?? null,
    difficulty_level: q.difficulty_level ?? null,
    essay_rubric: q.essay_rubric ?? null,
    sample_answer: q.sample_answer ?? null,
    answer_lines: q.answer_lines ?? null,
  }));
}

// ─── Markdown (.md) Round-Trip Export ────────────────────────────────────────

const MD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function formatQuestionsToMarkdown(questions: QuestionBankItem[]): string {
  if (questions.length === 0) return '';

  // Detect shared subject/grade across all exported questions for a clean frontmatter header
  const uniqueSubjects = Array.from(new Set(questions.map((q) => q.subject).filter(Boolean)));
  const uniqueGrades = Array.from(new Set(questions.map((q) => q.grade).filter(Boolean)));
  const sharedSubject = uniqueSubjects.length === 1 ? uniqueSubjects[0] : null;
  const sharedGrade = uniqueGrades.length === 1 ? uniqueGrades[0] : null;

  const chunks: string[] = [];

  if (sharedSubject || sharedGrade) {
    const fmLines = ['---'];
    if (sharedSubject) fmLines.push(`Fənn: ${sharedSubject}`);
    if (sharedGrade) fmLines.push(`Sinif: ${sharedGrade}`);
    fmLines.push('---');
    chunks.push(fmLines.join('\n'));
  }

  const questionBlocks = questions.map((q) => {
    const lines: string[] = [];
    const nonDefaultTypes = ['matching', 'ordering', 'fill_blank', 'numerical', 'code', 'essay'];
    if (nonDefaultTypes.includes(q.question_type)) {
      lines.push(`Tip: ${q.question_type}`);
    }

    const stem = q.question_type === 'fill_blank' && q.fill_blank_template
      ? q.fill_blank_template
      : q.question_text;
    lines.push(`# ${stem}`);

    if (q.question_type === 'matching' && q.matching_pairs) {
      const pairs = Array.isArray(q.matching_pairs)
        ? (q.matching_pairs as Array<{ left: string; right: string }>)
        : Object.entries(q.matching_pairs).map(([left, right]) => ({ left, right: String(right) }));
      for (const pair of pairs) {
        lines.push(`${pair.left} → ${pair.right}`);
      }
    } else if (q.question_type === 'ordering' && Array.isArray(q.sequence_items)) {
      for (const item of q.sequence_items) {
        lines.push(`- ${item}`);
      }
    } else if (Array.isArray(q.options) && q.options.length > 0 && !['short_answer', 'essay', 'numerical', 'fill_blank'].includes(q.question_type)) {
      q.options.forEach((opt, idx) => {
        lines.push(`${MD_LETTERS[idx] ?? idx + 1}) ${opt}`);
      });
    }

    lines.push('');

    if (q.correct_answer) {
      let answerOut = q.correct_answer;
      if (Array.isArray(q.options) && q.options.length > 0 && q.question_type === 'multiple_choice') {
        const matchIdx = q.options.findIndex((o) => o.trim() === q.correct_answer.trim());
        if (matchIdx !== -1 && MD_LETTERS[matchIdx]) {
          answerOut = MD_LETTERS[matchIdx];
        }
      }
      lines.push(`Cavab: ${answerOut}`);
    }

    if (q.subject && q.subject !== sharedSubject) lines.push(`Fənn: ${q.subject}`);
    if (q.grade && q.grade !== sharedGrade) lines.push(`Sinif: ${q.grade}`);
    if (q.topic) lines.push(`Mövzu: ${q.topic}`);
    if (q.category && q.category !== q.topic) lines.push(`Kateqoriya: ${q.category}`);
    if (q.curriculum_standard) lines.push(`Standart: ${q.curriculum_standard}`);
    if (q.difficulty_level) lines.push(`Səviyyə: ${q.difficulty_level}`);
    if (q.difficulty) lines.push(`Çətinlik: ${q.difficulty}`);
    if (q.weight != null) lines.push(`Çəki: ${q.weight}`);
    if (q.bloom_level) lines.push(`Bloom: ${q.bloom_level}`);
    if (q.tags && q.tags.length > 0) lines.push(`Taqlar: ${q.tags.join(', ')}`);
    if (Array.isArray(q.essay_rubric) && q.essay_rubric.length > 0) {
      const rubricStrings = q.essay_rubric.map((r) =>
        typeof r === 'string' ? r : `${(r as { criterion?: string }).criterion ?? ''}: ${(r as { maxPoints?: number }).maxPoints ?? ''} bal`
      ).filter(Boolean);
      if (rubricStrings.length > 0) lines.push(`Meyarlar: ${rubricStrings.join(' ; ')}`);
    }
    if (q.sample_answer) lines.push(`Nümunə cavab: ${q.sample_answer}`);
    if (q.answer_lines != null) lines.push(`Sətir: ${q.answer_lines}`);
    if (q.hint) lines.push(`İpucu: ${q.hint}`);
    if (q.explanation) lines.push(`İzahat: ${q.explanation}`);
    if (q.question_image_url) lines.push(`Şəkil: ${q.question_image_url}`);

    return lines.join('\n');
  });

  chunks.push(questionBlocks.join('\n\n---\n\n'));
  return chunks.join('\n\n');
}
