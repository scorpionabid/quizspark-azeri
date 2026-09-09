-- Migration: Enhance quiz attempts and creator access
-- Description:
-- 1. Adds question_order to quiz_attempts for preserving shuffled questions across resumes.
-- 2. Grants quiz creators SELECT permission on quiz_attempts for their quizzes.
-- 3. Grants students INSERT permission on answer_reviews for open-ended questions.

ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS question_order uuid[];

-- Enable quiz creators to view student attempts on their quizzes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_attempts' 
      AND policyname = 'Creators can view attempts of their quizzes'
  ) THEN
    CREATE POLICY "Creators can view attempts of their quizzes"
    ON public.quiz_attempts FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE quizzes.id = quiz_attempts.quiz_id
          AND quizzes.creator_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Enable students to submit open-ended answers to answer_reviews for teacher grading
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'answer_reviews' 
      AND policyname = 'Students can submit answers for review'
  ) THEN
    CREATE POLICY "Students can submit answers for review"
    ON public.answer_reviews FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.quiz_attempts qa
        WHERE qa.id = answer_reviews.attempt_id
          AND qa.user_id = auth.uid()
      )
    );
  END IF;
END $$;
