-- Migration: 20260906080000_link_questions_to_question_bank_and_feedbacks.sql
-- Description: Link questions to question_bank via foreign key, backfill IDs, auto-sync ratings to bank, and improve sync trigger.

-- 1. Add bank_question_id column to questions
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS bank_question_id UUID REFERENCES public.question_bank(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_questions_bank_question_id ON public.questions(bank_question_id);

-- 2. Backfill bank_question_id for existing questions based on text matching
UPDATE public.questions q
SET bank_question_id = sub.id
FROM (
  SELECT DISTINCT ON (TRIM(REGEXP_REPLACE(question_text, '\s+', ' ', 'g')))
    id,
    TRIM(REGEXP_REPLACE(question_text, '\s+', ' ', 'g')) as norm_text
  FROM public.question_bank
  ORDER BY TRIM(REGEXP_REPLACE(question_text, '\s+', ' ', 'g')), created_at ASC
) sub
WHERE TRIM(REGEXP_REPLACE(q.question_text, '\s+', ' ', 'g')) = sub.norm_text
  AND q.bank_question_id IS NULL;

-- 3. Backfill question_bank_id on question_ratings
UPDATE public.question_ratings qr
SET question_bank_id = q.bank_question_id
FROM public.questions q
WHERE qr.quiz_question_id = q.id
  AND qr.question_bank_id IS NULL
  AND q.bank_question_id IS NOT NULL;

-- 4. Trigger on question_ratings to auto-fill question_bank_id when rating a quiz_question
CREATE OR REPLACE FUNCTION set_question_rating_bank_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quiz_question_id IS NOT NULL AND NEW.question_bank_id IS NULL THEN
    SELECT bank_question_id INTO NEW.question_bank_id
    FROM public.questions
    WHERE id = NEW.quiz_question_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_question_rating_bank_id ON public.question_ratings;
CREATE TRIGGER trg_set_question_rating_bank_id
BEFORE INSERT ON public.question_ratings
FOR EACH ROW
EXECUTE FUNCTION set_question_rating_bank_id();

-- 5. Enhanced sync trigger from question_bank to questions in quizzes
CREATE OR REPLACE FUNCTION sync_question_bank_to_quiz_questions()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.questions
  SET 
    title = COALESCE(NEW.title, questions.title),
    question_text = NEW.question_text,
    options = NEW.options,
    correct_answer = NEW.correct_answer,
    explanation = NEW.explanation,
    hint = COALESCE(NEW.hint, questions.hint),
    topic = COALESCE(NEW.topic, questions.topic),
    difficulty = COALESCE(NEW.difficulty, questions.difficulty)
  WHERE 
    bank_question_id = NEW.id
    OR (
      bank_question_id IS NULL 
      AND TRIM(REGEXP_REPLACE(question_text, '\s+', ' ', 'g')) = TRIM(REGEXP_REPLACE(OLD.question_text, '\s+', ' ', 'g'))
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_question_bank_to_quiz_questions ON public.question_bank;
CREATE TRIGGER trg_sync_question_bank_to_quiz_questions
AFTER UPDATE ON public.question_bank
FOR EACH ROW
EXECUTE FUNCTION sync_question_bank_to_quiz_questions();

-- 6. Reload schema cache for PostgREST
NOTIFY pgrst, 'reload schema';

-- 7. Add policy for question_bank creators to view ratings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'question_ratings' 
      AND policyname = 'Question bank creators can view ratings for their bank question'
  ) THEN
    CREATE POLICY "Question bank creators can view ratings for their bank question"
    ON public.question_ratings FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM question_bank qb
        WHERE qb.id = question_ratings.question_bank_id
          AND qb.user_id = auth.uid()
      )
    );
  END IF;
END
$$;
