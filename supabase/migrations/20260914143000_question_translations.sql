-- Migration: 20260914143000_question_translations.sql
-- Description: Multi-language support for quiz questions and options (Georgian / ქართული)

CREATE TABLE IF NOT EXISTS public.question_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL, -- e.g. 'ka'
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  hint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_question_translations_lang UNIQUE (question_id, language_code)
);

-- Index for fast lookup during quiz runs
CREATE INDEX IF NOT EXISTS idx_question_translations_lookup 
ON public.question_translations(question_id, language_code);

-- Enable RLS
ALTER TABLE public.question_translations ENABLE ROW LEVEL SECURITY;

-- Allow candidates (anon & authenticated) to read translations for published quizzes
CREATE POLICY "Anyone can view translations for published questions"
ON public.question_translations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.questions q
    JOIN public.quizzes qz ON q.quiz_id = qz.id
    WHERE q.id = question_translations.question_id
      AND qz.is_published = true
  )
);

-- Service role & Admin manage policy
CREATE POLICY "Admins and service role can manage translations"
ON public.question_translations
FOR ALL
USING (
  auth.role() = 'service_role' OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);
