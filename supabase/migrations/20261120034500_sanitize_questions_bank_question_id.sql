-- Safely sanitize bank_question_id on public.questions before insert/update
-- Prevents HTTP 409 Conflict (questions_bank_question_id_fkey) when a question
-- has a localId or non-existent question_bank reference in browser drafts.

CREATE OR REPLACE FUNCTION public.sanitize_question_bank_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.bank_question_id IS NOT NULL THEN
    IF NEW.bank_question_id = NEW.id OR NOT EXISTS (
      SELECT 1 FROM public.question_bank WHERE id = NEW.bank_question_id
    ) THEN
      NEW.bank_question_id := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sanitize_question_bank_id ON public.questions;
CREATE TRIGGER trg_sanitize_question_bank_id
  BEFORE INSERT OR UPDATE OF bank_question_id ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_question_bank_id();
