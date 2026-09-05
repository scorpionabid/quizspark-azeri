-- Migration: 20260905165500_sync_question_bank_to_quiz_questions.sql
-- Description: Automatically propagate question updates (explanations, options, answers) from question_bank to questions in active quizzes.

CREATE OR REPLACE FUNCTION sync_question_bank_to_quiz_questions()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.explanation IS DISTINCT FROM NEW.explanation)
     OR (OLD.options IS DISTINCT FROM NEW.options)
     OR (OLD.hint IS DISTINCT FROM NEW.hint)
     OR (OLD.topic IS DISTINCT FROM NEW.topic)
     OR (OLD.correct_answer IS DISTINCT FROM NEW.correct_answer) THEN
     
     UPDATE public.questions
     SET 
       explanation = NEW.explanation,
       options = NEW.options,
       hint = COALESCE(NEW.hint, questions.hint),
       topic = COALESCE(NEW.topic, questions.topic),
       correct_answer = NEW.correct_answer
     WHERE 
       TRIM(REGEXP_REPLACE(question_text, '\s+', ' ', 'g')) = TRIM(REGEXP_REPLACE(OLD.question_text, '\s+', ' ', 'g'))
       AND TRIM(REGEXP_REPLACE(correct_answer, '\s+', ' ', 'g')) = TRIM(REGEXP_REPLACE(OLD.correct_answer, '\s+', ' ', 'g'));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_question_bank_to_quiz_questions ON question_bank;
CREATE TRIGGER trg_sync_question_bank_to_quiz_questions
AFTER UPDATE ON question_bank
FOR EACH ROW
EXECUTE FUNCTION sync_question_bank_to_quiz_questions();
