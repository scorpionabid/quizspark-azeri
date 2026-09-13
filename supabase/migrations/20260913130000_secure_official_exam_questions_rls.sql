-- Secure Official Exam Questions RLS & Ensure Quizzes are Visible
UPDATE quizzes 
SET is_public = true, is_published = true 
WHERE exam_category = 'official_exam';

DROP POLICY IF EXISTS "Anyone can view questions of published quizzes" ON questions;

CREATE POLICY "Anyone can view questions of published quizzes" ON questions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = questions.quiz_id
      AND quizzes.is_published = true
      AND (
        quizzes.exam_category IS DISTINCT FROM 'official_exam'
        OR
        has_role(auth.uid(), 'admin'::app_role)
        OR
        (
          auth.uid() IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM official_exam_settings
            WHERE official_exam_settings.id = 'current'
              AND official_exam_settings.is_active = true
          )
        )
      )
  )
);
