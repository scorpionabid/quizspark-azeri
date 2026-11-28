import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { PrintableQuestion } from '@/components/quiz/PrintableAssessmentView';
import {
  normalizeDifficultyLevel,
  isOpenEndedQuestionType,
  getDefaultAnswerLines,
} from '@/utils/assessmentSpec';

export interface TopicBlueprintSlot {
  topic: string;
  count: number;
  pointsPerQuestion: number;
  useBankWeight: boolean;
  difficultyFilter: 'balanced' | 'all' | 'I' | 'II' | 'III' | 'IV' | 'asan' | 'orta' | 'çətin';
  questionTypeFilter?: string;
}

export interface BlueprintShortfall {
  topic: string;
  requested: number;
  found: number;
  missingCount: number;
  pointsPerQuestion: number;
  difficultyFilter: TopicBlueprintSlot['difficultyFilter'];
  questionTypeFilter?: string;
}

export interface BankTopicStats {
  topic: string;
  count: number;
  standards: string[];
  levelCounts: Record<'I' | 'II' | 'III' | 'IV', number>;
  avgWeight: number;
}

export function getBankItemTopic(item: Pick<QuestionBankItem, 'topic' | 'category'>): string {
  return (item.topic || item.category || 'Ümumi mövzu').trim();
}

export function getBankItemLevel(
  item: Pick<QuestionBankItem, 'difficulty_level' | 'difficulty' | 'bloom_level'>
): 'I' | 'II' | 'III' | 'IV' {
  return (
    normalizeDifficultyLevel(item.difficulty_level ?? item.difficulty ?? item.bloom_level) ?? 'II'
  );
}

export function summarizeBankByTopics(bankQuestions: QuestionBankItem[]): BankTopicStats[] {
  const map = new Map<
    string,
    {
      count: number;
      standards: Set<string>;
      levelCounts: Record<'I' | 'II' | 'III' | 'IV', number>;
      weightSum: number;
    }
  >();

  for (const q of bankQuestions) {
    const topic = getBankItemTopic(q);
    let entry = map.get(topic);
    if (!entry) {
      entry = {
        count: 0,
        standards: new Set<string>(),
        levelCounts: { I: 0, II: 0, III: 0, IV: 0 },
        weightSum: 0,
      };
      map.set(topic, entry);
    }
    entry.count += 1;
    if (q.curriculum_standard) entry.standards.add(q.curriculum_standard);
    const lvl = getBankItemLevel(q);
    entry.levelCounts[lvl] += 1;
    entry.weightSum += q.weight ?? 5;
  }

  return Array.from(map.entries())
    .map(([topic, entry]) => ({
      topic,
      count: entry.count,
      standards: Array.from(entry.standards).sort(),
      levelCounts: entry.levelCounts,
      avgWeight: entry.count > 0 ? Math.round((entry.weightSum / entry.count) * 10) / 10 : 5,
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic, 'az'));
}

function normalizeRubricArray(
  raw?: string[] | Record<string, unknown>[] | null
): string[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const items = raw
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim();
      if (entry && typeof entry === 'object') {
        const crit = String((entry as { criterion?: unknown }).criterion ?? '').trim();
        const pts = (entry as { maxPoints?: unknown }).maxPoints;
        return crit ? (pts != null ? `${crit}: ${pts} bal` : crit) : '';
      }
      return '';
    })
    .filter(Boolean);
  return items.length > 0 ? items : null;
}

export function bankItemToPrintableQuestion(
  item: QuestionBankItem,
  overridePoints?: number | null
): PrintableQuestion {
  const isOpen = isOpenEndedQuestionType(item.question_type);
  const optionsArr = Array.isArray(item.options)
    ? item.options.map(String)
    : item.options && typeof item.options === 'object'
      ? Object.values(item.options).map(String)
      : null;

  return {
    id: item.id,
    bank_question_id: item.id,
    question_text: item.question_text,
    question_type: item.question_type,
    options: isOpen ? null : optionsArr,
    correct_answer: item.correct_answer,
    explanation: item.explanation ?? null,
    fill_blank_template: item.fill_blank_template ?? null,
    matching_pairs: item.matching_pairs ?? null,
    subjectLabel: item.subject ?? undefined,
    topic: getBankItemTopic(item),
    curriculum_standard: item.curriculum_standard ?? null,
    weight: overridePoints != null ? overridePoints : (item.weight ?? 5),
    difficulty: item.difficulty ?? null,
    level: item.difficulty_level ?? normalizeDifficultyLevel(item.difficulty ?? item.bloom_level),
    bloomLevel: item.bloom_level ?? null,
    rubric: normalizeRubricArray(item.essay_rubric),
    sample_answer: item.sample_answer ?? (isOpen ? item.correct_answer || null : null),
    answer_lines: item.answer_lines ?? (isOpen ? getDefaultAnswerLines(item.question_type) : null),
    question_image_url: item.question_image_url ?? null,
  };
}

function deterministicShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = Math.abs(seed) || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function matchesDifficultyFilter(
  item: QuestionBankItem,
  filter: TopicBlueprintSlot['difficultyFilter']
): boolean {
  if (filter === 'all' || filter === 'balanced') return true;
  if (['I', 'II', 'III', 'IV'].includes(filter)) {
    return getBankItemLevel(item) === filter;
  }
  return (item.difficulty || '').toLowerCase() === filter.toLowerCase();
}

function pickBalancedQuestions(
  candidates: QuestionBankItem[],
  count: number,
  seed: number
): QuestionBankItem[] {
  const buckets: Record<'I' | 'II' | 'III' | 'IV', QuestionBankItem[]> = {
    I: [],
    II: [],
    III: [],
    IV: [],
  };

  for (const item of deterministicShuffle(candidates, seed)) {
    buckets[getBankItemLevel(item)].push(item);
  }

  // Target KSQ/BSQ proportions: I (20%), II (30%), III (30%), IV (20%)
  const order: Array<'I' | 'II' | 'III' | 'IV'> = ['II', 'III', 'I', 'IV', 'II', 'III', 'I', 'IV', 'II', 'III'];
  const picked: QuestionBankItem[] = [];
  let cursor = 0;

  while (picked.length < count) {
    let addedInRound = false;
    for (let tries = 0; tries < order.length && picked.length < count; tries++) {
      const lvl = order[(cursor + tries) % order.length];
      const nextItem = buckets[lvl].shift();
      if (nextItem) {
        picked.push(nextItem);
        cursor = (cursor + tries + 1) % order.length;
        addedInRound = true;
        break;
      }
    }
    if (!addedInRound) break;
  }

  // Order final selection gently from easiest (I) to hardest (IV)
  const rank: Record<'I' | 'II' | 'III' | 'IV', number> = { I: 1, II: 2, III: 3, IV: 4 };
  return picked.sort((a, b) => rank[getBankItemLevel(a)] - rank[getBankItemLevel(b)]);
}

/**
 * Verilmiş mövzu-bal-çətinlik blueprint matrisinə uyğun Sual Bankından
 * təkrarsız imtahan sualları yığır və çatışmayan slotları qaytarır.
 */
export function assembleExamFromBlueprint(
  bankQuestions: QuestionBankItem[],
  slots: TopicBlueprintSlot[],
  seed = Date.now()
): {
  questions: PrintableQuestion[];
  shortfalls: BlueprintShortfall[];
} {
  const usedIds = new Set<string>();
  const assembled: PrintableQuestion[] = [];
  const shortfalls: BlueprintShortfall[] = [];

  slots.forEach((slot, slotIdx) => {
    if (slot.count <= 0) return;

    const candidates = bankQuestions.filter((q) => {
      if (usedIds.has(q.id)) return false;
      if (getBankItemTopic(q) !== slot.topic) return false;
      if (
        slot.questionTypeFilter &&
        slot.questionTypeFilter !== 'all' &&
        q.question_type !== slot.questionTypeFilter
      ) {
        return false;
      }
      return matchesDifficultyFilter(q, slot.difficultyFilter);
    });

    const chosen =
      slot.difficultyFilter === 'balanced'
        ? pickBalancedQuestions(candidates, slot.count, seed + slotIdx * 31)
        : deterministicShuffle(candidates, seed + slotIdx * 31).slice(0, slot.count);

    for (const item of chosen) {
      usedIds.add(item.id);
      assembled.push(
        bankItemToPrintableQuestion(item, slot.useBankWeight ? null : slot.pointsPerQuestion)
      );
    }

    if (chosen.length < slot.count) {
      shortfalls.push({
        topic: slot.topic,
        requested: slot.count,
        found: chosen.length,
        missingCount: slot.count - chosen.length,
        pointsPerQuestion: slot.pointsPerQuestion,
        difficultyFilter: slot.difficultyFilter,
        questionTypeFilter: slot.questionTypeFilter,
      });
    }
  });

  return { questions: assembled, shortfalls };
}

/**
 * Önizləmədəki sualı eyni mövzudan (və ya ümumi hovuzdan) istifadə edilməmiş
 * başqa bir Sual Bankı sualı ilə əvəz etmək üçün namizəd tapır.
 */
export function findSwapCandidate(
  bankQuestions: QuestionBankItem[],
  current: PrintableQuestion,
  usedBankIds: Set<string>
): QuestionBankItem | null {
  const sameTopic = bankQuestions.filter(
    (q) => !usedBankIds.has(q.id) && (!current.topic || getBankItemTopic(q) === current.topic)
  );
  if (sameTopic.length > 0) {
    return sameTopic[Math.floor(Math.random() * sameTopic.length)];
  }
  const fallback = bankQuestions.filter((q) => !usedBankIds.has(q.id));
  if (fallback.length > 0) {
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return null;
}
