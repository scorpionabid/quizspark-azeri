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

export const CORE_SUBJECTS = [
  "Azərbaycan dili",
  "Riyaziyyat",
  "İngilis dili",
  "Ədəbiyyat",
  "Tarix",
  "Coğrafiya",
  "Fizika",
  "Kimya",
  "Biologiya",
  "İnformatika",
] as const;

export const OTHER_SUBJECTS = [
  "Musiqi",
  "Təsviri incəsənət",
  "Rus dili",
  "Texnologiya",
  "Həyat bilgisi",
  "Bədən tərbiyəsi",
  "Çağırışaqədərki hazırlıq",
] as const;

export const ALL_SCHOOL_SUBJECTS = [...CORE_SUBJECTS, ...OTHER_SUBJECTS] as const;

export const SCHOOL_GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const SUBJECT_LABELS: Record<string, string> = Object.fromEntries(
  SUBJECT_OPTIONS.map((s) => [s.value, s.label])
);

export const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Çoxseçimli" },
  { value: "true_false", label: "Doğru/Yanlış" },
  { value: "short_answer", label: "Qısa Cavab" },
  { value: "fill_blank", label: "Boşluq Doldur" },
  { value: "matching", label: "Uyğunlaşdırma" },
  { value: "numerical", label: "Rəqəmsal Cavab" },
] as const;
