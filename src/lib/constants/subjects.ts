export const SUBJECT_OPTIONS = [
  { value: "math", label: "Riyaziyyat" },
  { value: "physics", label: "Fizika" },
  { value: "chemistry", label: "Kimya" },
  { value: "biology", label: "Biologiya" },
  { value: "history", label: "Tarix" },
  { value: "geography", label: "Coğrafiya" },
  { value: "literature", label: "Ədəbiyyat" },
  { value: "informatics", label: "İnformatika" },
  { value: "english", label: "İngilis dili" },
  { value: "azerbaijani", label: "Azərbaycan dili" },
  { value: "music", label: "Musiqi" },
  { value: "sports", label: "İdman" },
  { value: "law", label: "Hüquq" },
  { value: "economics", label: "İqtisadiyyat" },
  { value: "philosophy", label: "Fəlsəfə" },
] as const;

export const SUBJECT_LABELS: Record<string, string> = Object.fromEntries(
  SUBJECT_OPTIONS.map((s) => [s.value, s.label])
);

export const SUBJECT_ICONS: Record<string, string> = {
  'Dövlət Qulluğu': '🏛️',
  'Dövlət Qulluğu (Tam İmtahan)': '🏛️',
  'DQ': '🏛️',
  'Dq': '🏛️',
  'Dövlət Qulluğu-1': '🏛️',
  'Qanunvericilik': '⚖️',
  'Konstitusiya': '⚖️',
  'Məntiq': '💡',
  'Məntiqi Təfəkkür': '💡',
  'İnformatika': '💻',
  'İnformatika və Rəqəmsal Savadlılıq': '💻',
  'Azərbaycan dili': '🇦🇿',
  'Azərbaycan Dili və Yazı Qaydaları': '🇦🇿',
  'Riyaziyyat': '🔢',
  'Fizika': '⚡',
  'Kimya': '🧪',
  'Biologiya': '🧬',
  'Tarix': '📜',
  'Coğrafiya': '🌍',
  'Ədəbiyyat': '📚',
  'İngilis dili': '🇬🇧',
  'Hüquq': '⚖️',
  'İqtisadiyyat': '📊',
  'Fəlsəfə': '🧠',
  'Musiqi': '🎵',
  'İdman': '⚽',
};

export function getSubjectIcon(subject?: string | null): string {
  if (!subject) return '📖';
  const trimmed = subject.trim();
  if (SUBJECT_ICONS[trimmed]) return SUBJECT_ICONS[trimmed];

  const lower = trimmed.toLowerCase();
  if (lower.includes('dövlət qulluq') || lower === 'dq' || lower.startsWith('dq')) return '🏛️';
  if (
    lower.includes('konstitusiya') ||
    lower.includes('qanun') ||
    lower.includes('hüquq') ||
    lower.includes('etik') ||
    lower.includes('inzibati') ||
    lower.includes('korrupsiya')
  ) {
    return '⚖️';
  }
  if (lower.includes('məntiq')) return '💡';
  if (lower.includes('informatika') || lower.includes('kompüter') || lower.includes('rəqəmsal')) return '💻';
  if (lower.includes('azərbaycan dili') || lower.includes('dövlət dili')) return '🇦🇿';
  if (lower.includes('riyaziyy')) return '🔢';
  if (lower.includes('fizika')) return '⚡';
  if (lower.includes('kimya')) return '🧪';
  if (lower.includes('biolog')) return '🧬';
  if (lower.includes('tarix')) return '📜';
  if (lower.includes('coğraf')) return '🌍';
  if (lower.includes('ədəbiyyat')) return '📚';
  if (lower.includes('ingilis')) return '🇬🇧';
  if (lower.includes('iqtisad')) return '📊';

  return '📖';
}

export const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Çoxseçimli" },
  { value: "true_false", label: "Doğru/Yanlış" },
  { value: "short_answer", label: "Qısa Cavab" },
  { value: "fill_blank", label: "Boşluq Doldur" },
  { value: "matching", label: "Uyğunlaşdırma" },
  { value: "numerical", label: "Rəqəmsal Cavab" },
] as const;
