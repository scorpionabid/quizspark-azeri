-- Migration: 20260906071000_fix_quiz_stats_and_feedbacks_foreign_keys.sql
-- Description: Add foreign keys from quiz_results and question_ratings to profiles(user_id) to enable PostgREST resource embedding, and ensure quiz creators can view feedbacks.

DO $$
BEGIN
  -- 1. quiz_results -> profiles(user_id)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'quiz_results_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.quiz_results 
      ADD CONSTRAINT quiz_results_user_id_profiles_fkey 
      FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- 2. question_ratings -> profiles(user_id)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'question_ratings_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.question_ratings 
      ADD CONSTRAINT question_ratings_user_id_profiles_fkey 
      FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Policy for quiz creators to view feedbacks
DROP POLICY IF EXISTS "Quiz creators can view ratings for their quiz questions" ON public.question_ratings;
CREATE POLICY "Quiz creators can view ratings for their quiz questions"
ON public.question_ratings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.questions q
    JOIN public.quizzes qz ON q.quiz_id = qz.id
    WHERE q.id = question_ratings.quiz_question_id
      AND qz.creator_id = auth.uid()
  )
);

NOTIFY pgrst, 'reload schema';
