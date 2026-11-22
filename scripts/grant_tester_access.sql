-- Grant full testing and question bank access to Züleyxa Zəkili (and sync tester access)

-- 1. Upgrade subscription tier to VIP for Züleyxa Zəkili
UPDATE public.profiles
SET subscription_tier = 'vip'
WHERE email = 'zuleykha.zakili@gmail.com' OR user_id = '12e0fa23-6380-4a97-9a4c-e3326851c865';

-- 2. Quizzes: view
DROP POLICY IF EXISTS "Creators and authorized editors can view quizzes" ON public.quizzes;
CREATE POLICY "Creators and authorized editors can view quizzes"
ON public.quizzes FOR SELECT
USING (
  (auth.uid() = creator_id)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (auth.uid() IN (
    '12e0fa23-6380-4a97-9a4c-e3326851c865'::uuid,
    '3a91c4a9-46bc-4dc3-86e9-b5a156a4b189'::uuid,
    '5df8d858-bc0b-4ded-a165-2517d0bc2dbc'::uuid
  ))
);

-- 3. Quizzes: update
DROP POLICY IF EXISTS "Creators and authorized editors can update quizzes" ON public.quizzes;
CREATE POLICY "Creators and authorized editors can update quizzes"
ON public.quizzes FOR UPDATE
USING (
  (auth.uid() = creator_id)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (auth.uid() IN (
    '12e0fa23-6380-4a97-9a4c-e3326851c865'::uuid,
    '3a91c4a9-46bc-4dc3-86e9-b5a156a4b189'::uuid,
    '5df8d858-bc0b-4ded-a165-2517d0bc2dbc'::uuid
  ))
);

-- 4. Questions: manage
DROP POLICY IF EXISTS "Creators and authorized editors can manage questions" ON public.questions;
CREATE POLICY "Creators and authorized editors can manage questions"
ON public.questions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = questions.quiz_id
      AND (
        (quizzes.creator_id = auth.uid())
        OR has_role(auth.uid(), 'admin'::app_role)
        OR (auth.uid() IN (
          '12e0fa23-6380-4a97-9a4c-e3326851c865'::uuid,
          '3a91c4a9-46bc-4dc3-86e9-b5a156a4b189'::uuid,
          '5df8d858-bc0b-4ded-a165-2517d0bc2dbc'::uuid
        ))
      )
  )
);

-- 5. Question Bank: update
DROP POLICY IF EXISTS "Users and authorized editors can update question bank" ON public.question_bank;
CREATE POLICY "Users and authorized editors can update question bank"
ON public.question_bank FOR UPDATE
USING (
  (auth.uid() = user_id)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (auth.uid() IN (
    '12e0fa23-6380-4a97-9a4c-e3326851c865'::uuid,
    '3a91c4a9-46bc-4dc3-86e9-b5a156a4b189'::uuid,
    '5df8d858-bc0b-4ded-a165-2517d0bc2dbc'::uuid
  ))
);

-- 6. Question Bank: delete
DROP POLICY IF EXISTS "Users and authorized editors can delete question bank" ON public.question_bank;
CREATE POLICY "Users and authorized editors can delete question bank"
ON public.question_bank FOR DELETE
USING (
  (auth.uid() = user_id)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (auth.uid() IN (
    '12e0fa23-6380-4a97-9a4c-e3326851c865'::uuid,
    '3a91c4a9-46bc-4dc3-86e9-b5a156a4b189'::uuid,
    '5df8d858-bc0b-4ded-a165-2517d0bc2dbc'::uuid
  ))
);

-- 7. Question Bank: select
DROP POLICY IF EXISTS "question_bank_select" ON public.question_bank;
CREATE POLICY "question_bank_select"
ON public.question_bank FOR SELECT
USING (
  (user_id = auth.uid())
  OR (user_id IS NULL)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid)
  OR (auth.uid() IN (
    '12e0fa23-6380-4a97-9a4c-e3326851c865'::uuid,
    '3a91c4a9-46bc-4dc3-86e9-b5a156a4b189'::uuid,
    '5df8d858-bc0b-4ded-a165-2517d0bc2dbc'::uuid
  ))
  OR (EXISTS (
    SELECT 1 FROM question_bank_shares qbs
    WHERE qbs.question_id = question_bank.id
      AND qbs.shared_with = auth.uid()
  ))
);

-- 8. Quiz Attempts: view
DROP POLICY IF EXISTS "Creators and authorized editors can view attempts" ON public.quiz_attempts;
CREATE POLICY "Creators and authorized editors can view attempts"
ON public.quiz_attempts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_attempts.quiz_id
      AND (
        (quizzes.creator_id = auth.uid())
        OR has_role(auth.uid(), 'admin'::app_role)
        OR (auth.uid() IN (
          '12e0fa23-6380-4a97-9a4c-e3326851c865'::uuid,
          '3a91c4a9-46bc-4dc3-86e9-b5a156a4b189'::uuid,
          '5df8d858-bc0b-4ded-a165-2517d0bc2dbc'::uuid
        ))
      )
  )
);
