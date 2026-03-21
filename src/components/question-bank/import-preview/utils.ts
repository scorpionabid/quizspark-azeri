import { PreviewQuestion } from '@/utils/parsers/types';
import { ParseWarning } from '@/utils/parsers/types';

export function isValidQuestion(q: PreviewQuestion, warnings: ParseWarning[] = []): boolean {
  const qWarnings = warnings.filter(w => {
    const qt = q.question_text?.slice(0, 35) ?? '';
    return w.message.includes(qt);
  });
  if (qWarnings.some(w => w.severity === 'error')) return false;

  if (!q.question_text?.trim()) return false;
  const qt = q.question_type;
  if (qt === 'matching') return !!(q.matching_pairs && Object.keys(q.matching_pairs).length >= 2);
  if (qt === 'ordering') return !!(q.sequence_items && q.sequence_items.length >= 2);
  if (qt === 'numerical') return q.numerical_answer != null || !!(q.correct_answer?.trim());
  if (qt === 'fill_blank') return !!(q.correct_answer?.trim() || q.fill_blank_template?.includes('___'));
  if (qt === 'essay') return !!(q.question_text?.trim());
  return !!(q.correct_answer?.trim());
}

export interface PreviewStats {
  categoryMap: Record<string, number>;
  diffMap: Record<string, number>;
  typeMap: Record<string, number>;
  topCategories: Array<[string, number]>;
}

export function computeStats(questions: PreviewQuestion[]): PreviewStats {
  const categoryMap: Record<string, number> = {};
  const diffMap: Record<string, number> = {};
  const typeMap: Record<string, number> = {};

  for (const q of questions) {
    const cat = q.category || 'Digər';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;

    const diff = q.difficulty || 'orta';
    diffMap[diff] = (diffMap[diff] || 0) + 1;

    const type = q.question_type || 'multiple_choice';
    typeMap[type] = (typeMap[type] || 0) + 1;
  }

  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return { categoryMap, diffMap, typeMap, topCategories };
}
