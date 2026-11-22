-- Phase 1: Add question_count column to quizzes
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS question_count integer DEFAULT 0;

-- Backfill existing counts
UPDATE public.quizzes q
SET question_count = COALESCE((
  SELECT count(*)::integer FROM public.questions qs WHERE qs.quiz_id = q.id
), 0);

-- Trigger function to automatically maintain question_count
CREATE OR REPLACE FUNCTION public.sync_quiz_question_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.quizzes
    SET question_count = COALESCE(question_count, 0) + 1
    WHERE id = NEW.quiz_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.quizzes
    SET question_count = GREATEST(0, COALESCE(question_count, 1) - 1)
    WHERE id = OLD.quiz_id;
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.quiz_id IS DISTINCT FROM NEW.quiz_id) THEN
      UPDATE public.quizzes
      SET question_count = GREATEST(0, COALESCE(question_count, 1) - 1)
      WHERE id = OLD.quiz_id;
      
      UPDATE public.quizzes
      SET question_count = COALESCE(question_count, 0) + 1
      WHERE id = NEW.quiz_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_sync_quiz_question_count ON public.questions;
CREATE TRIGGER trigger_sync_quiz_question_count
AFTER INSERT OR DELETE OR UPDATE OF quiz_id ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.sync_quiz_question_count();

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_xp_points ON public.profiles (xp_points DESC);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_order ON public.questions (quiz_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quizzes_public_created ON public.quizzes (is_published, is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quizzes_public_plays ON public.quizzes (is_published, is_public, play_count DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_user ON public.quiz_results (quiz_id, user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_user ON public.quiz_attempts (quiz_id, user_id, started_at DESC);
