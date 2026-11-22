-- Migration: 20261115190000_allow_admin_and_editors_update_quizzes.sql
-- Description: Allow admins and designated Olympiad editors to update/manage quizzes and questions

-- 1. Quizzes: Allow admins and Olympiad editors to update
DROP POLICY IF EXISTS "Admins and editors can update quizzes" ON public.quizzes;
CREATE POLICY "Admins and editors can update quizzes"
ON public.quizzes FOR UPDATE
USING (
  auth.uid() = creator_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR (
    exam_category = 'Olimpiada'
    AND auth.jwt() ->> 'email' IN (
      'scorpionabid82@gmail.com',
      'gunel.hadjiyeva@gmail.com',
      'alqish82@gmail.com',
      'zuleykha.zakili@gmail.com'
    )
  )
);

-- 2. Quizzes: Allow admins to delete quizzes
DROP POLICY IF EXISTS "Admins can delete all quizzes" ON public.quizzes;
CREATE POLICY "Admins can delete all quizzes"
ON public.quizzes FOR DELETE
USING (
  auth.uid() = creator_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Questions: Allow admins and Olympiad editors to manage quiz questions
DROP POLICY IF EXISTS "Creators can manage their quiz questions" ON public.questions;
CREATE POLICY "Creators can manage their quiz questions"
ON public.questions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes 
    WHERE quizzes.id = questions.quiz_id 
    AND (
      quizzes.creator_id = auth.uid()
      OR public.has_role(auth.uid(), 'admin'::app_role)
      OR (
        quizzes.exam_category = 'Olimpiada'
        AND auth.jwt() ->> 'email' IN (
          'scorpionabid82@gmail.com',
          'gunel.hadjiyeva@gmail.com',
          'alqish82@gmail.com',
          'zuleykha.zakili@gmail.com'
        )
      )
    )
  )
);
