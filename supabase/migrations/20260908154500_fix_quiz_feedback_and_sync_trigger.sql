-- Migration: 20260908154500_fix_quiz_feedback_and_sync_trigger.sql
-- Description:
-- 1. Fix sync_question_bank_to_quiz_questions() by removing non-existent difficulty column on public.questions
--    and restoring check so it only triggers on actual content changes (not quality_score changes).
-- 2. Drop global UNIQUE (user_id, question_bank_id) constraint on question_ratings which conflicted
--    when multiple quiz questions share the same bank_question_id. Replace with partial unique index
--    for bank-only ratings (WHERE quiz_question_id IS NULL).
-- 3. Enhance update_question_quality_score() with SECURITY DEFINER and schema safety so student feedback
--    can calculate and update quality_score on question_bank without RLS permission rejection.
-- 4. Set set_question_rating_bank_id() with SECURITY DEFINER and BEFORE INSERT OR UPDATE trigger.

-- 1. Fix sync_question_bank_to_quiz_questions
CREATE OR REPLACE FUNCTION public.sync_question_bank_to_quiz_questions()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update quiz questions when actual question content/metadata changes
  IF (OLD.title IS DISTINCT FROM NEW.title)
     OR (OLD.question_text IS DISTINCT FROM NEW.question_text)
     OR (OLD.options IS DISTINCT FROM NEW.options)
     OR (OLD.correct_answer IS DISTINCT FROM NEW.correct_answer)
     OR (OLD.explanation IS DISTINCT FROM NEW.explanation)
     OR (OLD.hint IS DISTINCT FROM NEW.hint)
     OR (OLD.topic IS DISTINCT FROM NEW.topic) THEN

    UPDATE public.questions
    SET 
      title = COALESCE(NEW.title, questions.title),
      question_text = NEW.question_text,
      options = NEW.options,
      correct_answer = NEW.correct_answer,
      explanation = NEW.explanation,
      hint = COALESCE(NEW.hint, questions.hint),
      topic = COALESCE(NEW.topic, questions.topic)
    WHERE 
      bank_question_id = NEW.id
      OR (
        bank_question_id IS NULL 
        AND TRIM(REGEXP_REPLACE(question_text, '\s+', ' ', 'g')) = TRIM(REGEXP_REPLACE(OLD.question_text, '\s+', ' ', 'g'))
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix unique constraint on question_ratings
-- Drop the constraint that blocked students from rating multiple quiz questions sharing one bank_question_id
ALTER TABLE public.question_ratings 
  DROP CONSTRAINT IF EXISTS question_ratings_user_id_question_bank_id_key;

-- Recreate unique index only for bank ratings (when not rating inside a quiz)
CREATE UNIQUE INDEX IF NOT EXISTS question_ratings_user_bank_unique_idx 
  ON public.question_ratings (user_id, question_bank_id) 
  WHERE quiz_question_id IS NULL;

-- 3. Enhance update_question_quality_score with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_question_quality_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.question_bank_id IS NOT NULL THEN
    UPDATE public.question_bank
    SET quality_score = (
      SELECT ROUND(AVG(rating::NUMERIC), 2)
      FROM public.question_ratings
      WHERE question_bank_id = NEW.question_bank_id
    )
    WHERE id = NEW.question_bank_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Update set_question_rating_bank_id function and trigger
CREATE OR REPLACE FUNCTION public.set_question_rating_bank_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quiz_question_id IS NOT NULL AND NEW.question_bank_id IS NULL THEN
    SELECT bank_question_id INTO NEW.question_bank_id
    FROM public.questions
    WHERE id = NEW.quiz_question_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_question_rating_bank_id ON public.question_ratings;
CREATE TRIGGER trg_set_question_rating_bank_id
BEFORE INSERT OR UPDATE ON public.question_ratings
FOR EACH ROW
EXECUTE FUNCTION public.set_question_rating_bank_id();

-- 5. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
