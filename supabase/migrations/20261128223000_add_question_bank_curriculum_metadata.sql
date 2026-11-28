-- Add structured curriculum & assessment metadata to question_bank
-- Keeps 100% backward compatibility with existing category, difficulty, topic, curriculum_standard, weight, and RLS policies.

ALTER TABLE public.question_bank
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS grade TEXT,
  ADD COLUMN IF NOT EXISTS difficulty_level TEXT,
  ADD COLUMN IF NOT EXISTS sample_answer TEXT,
  ADD COLUMN IF NOT EXISTS answer_lines INTEGER;

COMMENT ON COLUMN public.question_bank.subject IS 'Fənn adı (məs: Riyaziyyat, Təbiət, Azərbaycan dili)';
COMMENT ON COLUMN public.question_bank.grade IS 'Sinif (məs: 6-cı sinif)';
COMMENT ON COLUMN public.question_bank.difficulty_level IS 'KSQ/BSQ standart çətinlik səviyyəsi (I, II, III, IV)';
COMMENT ON COLUMN public.question_bank.sample_answer IS 'Açıq suallar üçün nümunə cavab (KaTeX/LaTeX dəstəkli)';
COMMENT ON COLUMN public.question_bank.answer_lines IS 'Çap vərəqində açıq sual üçün ayrılan yazı sətirlərinin sayı';

CREATE INDEX IF NOT EXISTS idx_question_bank_subject_grade_topic
  ON public.question_bank (subject, grade, topic);

CREATE INDEX IF NOT EXISTS idx_question_bank_curriculum_standard
  ON public.question_bank (curriculum_standard);

CREATE INDEX IF NOT EXISTS idx_question_bank_difficulty_level
  ON public.question_bank (difficulty_level);
