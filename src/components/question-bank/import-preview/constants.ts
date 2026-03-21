export const PAGE_SIZE = 50;

export const DIFFICULTY_COLORS: Record<string, string> = {
  asan: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  orta: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  çətin: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
};

export const TYPE_LABELS: Record<string, string> = {
  multiple_choice: 'Çoxseçimli',
  true_false: 'Doğru/Yanlış',
  short_answer: 'Qısa Cavab',
  essay: 'Esse',
  matching: 'Uyğunlaşdırma',
  ordering: 'Sıralama',
  numerical: 'Rəqəmsal',
  fill_in_the_blank: 'Boşluq Doldur',
  fill_blank: 'Boşluq Doldur',
  code: 'Kod',
};
