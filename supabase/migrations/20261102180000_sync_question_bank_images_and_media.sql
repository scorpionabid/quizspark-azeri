-- Migration: 20261102180000_sync_question_bank_images_and_media.sql
-- Description: Expand sync_question_bank_to_quiz_questions trigger to propagate image, media, and option changes,
-- and backfill currently desynced quiz question images.

CREATE OR REPLACE FUNCTION public.sync_question_bank_to_quiz_questions()
RETURNS TRIGGER AS $$
BEGIN
  -- Propagate question updates from question_bank to questions in active quizzes
  IF (OLD.title IS DISTINCT FROM NEW.title)
     OR (OLD.question_text IS DISTINCT FROM NEW.question_text)
     OR (OLD.question_type IS DISTINCT FROM NEW.question_type)
     OR (OLD.options IS DISTINCT FROM NEW.options)
     OR (OLD.correct_answer IS DISTINCT FROM NEW.correct_answer)
     OR (OLD.correct_option_indices IS DISTINCT FROM NEW.correct_option_indices)
     OR (OLD.explanation IS DISTINCT FROM NEW.explanation)
     OR (OLD.hint IS DISTINCT FROM NEW.hint)
     OR (OLD.topic IS DISTINCT FROM NEW.topic)
     OR (OLD.question_image_url IS DISTINCT FROM NEW.question_image_url)
     OR (OLD.option_images IS DISTINCT FROM NEW.option_images)
     OR (OLD.media_type IS DISTINCT FROM NEW.media_type)
     OR (OLD.media_url IS DISTINCT FROM NEW.media_url)
     OR (OLD.per_option_explanations IS DISTINCT FROM NEW.per_option_explanations)
     OR (OLD.matching_pairs IS DISTINCT FROM NEW.matching_pairs)
     OR (OLD.sequence_items IS DISTINCT FROM NEW.sequence_items)
     OR (OLD.hotspot_data IS DISTINCT FROM NEW.hotspot_data)
     OR (OLD.fill_blank_template IS DISTINCT FROM NEW.fill_blank_template)
     OR (OLD.numerical_answer IS DISTINCT FROM NEW.numerical_answer)
     OR (OLD.numerical_tolerance IS DISTINCT FROM NEW.numerical_tolerance)
     OR (OLD.weight IS DISTINCT FROM NEW.weight)
     OR (OLD.time_limit IS DISTINCT FROM NEW.time_limit) THEN

    UPDATE public.questions
    SET 
      title = COALESCE(NEW.title, questions.title),
      question_text = NEW.question_text,
      question_type = NEW.question_type,
      options = NEW.options,
      correct_answer = NEW.correct_answer,
      correct_option_indices = NEW.correct_option_indices,
      explanation = NEW.explanation,
      hint = COALESCE(NEW.hint, questions.hint),
      topic = COALESCE(NEW.topic, questions.topic),
      question_image_url = NEW.question_image_url,
      option_images = NEW.option_images,
      media_type = NEW.media_type,
      media_url = NEW.media_url,
      per_option_explanations = NEW.per_option_explanations,
      matching_pairs = NEW.matching_pairs,
      sequence_items = NEW.sequence_items,
      hotspot_data = NEW.hotspot_data,
      fill_blank_template = NEW.fill_blank_template,
      numerical_answer = NEW.numerical_answer,
      numerical_tolerance = NEW.numerical_tolerance,
      weight = COALESCE(NEW.weight, questions.weight),
      time_limit = COALESCE(NEW.time_limit, questions.time_limit)
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

-- Re-create trigger if needed
DROP TRIGGER IF EXISTS trg_sync_question_bank_to_quiz_questions ON public.question_bank;
CREATE TRIGGER trg_sync_question_bank_to_quiz_questions
AFTER UPDATE ON public.question_bank
FOR EACH ROW
EXECUTE FUNCTION public.sync_question_bank_to_quiz_questions();

-- Sync existing desynced question images
UPDATE public.questions q
SET question_image_url = qb.question_image_url
FROM public.question_bank qb
WHERE q.bank_question_id = qb.id
  AND q.question_image_url IS DISTINCT FROM qb.question_image_url;

-- Reload schema
NOTIFY pgrst, 'reload schema';
