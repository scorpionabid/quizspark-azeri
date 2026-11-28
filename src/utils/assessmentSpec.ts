export const QUESTION_TYPE_LABELS_AZ: Record<string, string> = {
  multiple_choice: 'Çoxseçimli (Qapalı)',
  multiple_select: 'Çoxlu seçim',
  true_false: 'Doğru / Yanlış',
  short_answer: 'Qısa cavab (Açıq)',
  essay: 'Esse (Açıq)',
  fill_blank: 'Boşluq doldur',
  matching: 'Uyğunlaşdırma',
  ordering: 'Ardıcıllıq',
  numerical: 'Rəqəmsal cavab',
  code: 'Kod sualı',
  hotspot: 'Hotspot',
  diagram_label: 'Diaqram etiketləmə',
  matrix_choice: 'Matris seçimi',
};

export function getQuestionTypeLabelAz(type?: string | null): string {
  if (!type) return 'Sual';
  return QUESTION_TYPE_LABELS_AZ[type] ?? type;
}

export function normalizeDifficultyLevel(raw?: string | null): 'I' | 'II' | 'III' | 'IV' | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === 'i' || v === '1' || v === 'i səviyyə' || v === 'easy' || v === 'asan' || v === 'remembering') {
    return 'I';
  }
  if (
    v === 'ii' ||
    v === '2' ||
    v === 'ii səviyyə' ||
    v === 'medium' ||
    v === 'orta' ||
    v === 'understanding' ||
    v === 'applying'
  ) {
    return 'II';
  }
  if (v === 'iii' || v === '3' || v === 'iii səviyyə' || v === 'hard' || v === 'çətin' || v === 'analyzing') {
    return 'III';
  }
  if (
    v === 'iv' ||
    v === '4' ||
    v === 'iv səviyyə' ||
    v === 'very_hard' ||
    v === 'expert' ||
    v === 'evaluating' ||
    v === 'creating'
  ) {
    return 'IV';
  }
  return null;
}

export function isOpenEndedQuestionType(type?: string | null): boolean {
  if (!type) return false;
  return (
    type === 'short_answer' ||
    type === 'essay' ||
    type === 'fill_blank' ||
    type === 'numerical'
  );
}

export function getDefaultAnswerLines(type?: string | null): number {
  if (type === 'essay') return 6;
  if (type === 'short_answer') return 3;
  return 2;
}

export function normalizeMatchingPairs(
  pairs?: Array<{ left: string; right: string }> | Record<string, string> | null
): Array<{ left: string; right: string }> {
  if (!pairs) return [];
  if (Array.isArray(pairs)) return pairs;
  return Object.entries(pairs).map(([left, right]) => ({ left, right }));
}
