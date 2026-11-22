-- Migration: 20261120041500_fix_quiz_results_attempt_unique_constraint.sql
-- Purpose:
-- 1. Replace partial unique index with a standard UNIQUE constraint on public.quiz_results(attempt_id)
--    so that ON CONFLICT (attempt_id) works in PostgreSQL and PostgREST.
-- 2. Enhance complete_quiz_attempt_atomic so that if an attempt was already marked completed,
--    it still ensures a corresponding quiz_results row exists.
-- 3. Backfill any completed quiz_attempts that were missing quiz_results rows due to the conflict error.

-- 1. Replace partial index with a standard unique constraint
DROP INDEX IF EXISTS public.uq_quiz_results_attempt;

ALTER TABLE public.quiz_results 
DROP CONSTRAINT IF EXISTS uq_quiz_results_attempt;

ALTER TABLE public.quiz_results 
ADD CONSTRAINT uq_quiz_results_attempt UNIQUE (attempt_id);

-- 2. Enhanced atomic completion procedure
CREATE OR REPLACE FUNCTION public.complete_quiz_attempt_atomic(
  p_attempt_id UUID,
  p_quiz_id UUID,
  p_user_id UUID,
  p_score INTEGER,
  p_total_questions INTEGER,
  p_time_spent INTEGER,
  p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_already_completed TIMESTAMPTZ;
  v_result_id UUID;
  v_existing_score INTEGER;
BEGIN
  -- Lock attempt row to prevent concurrent race condition
  SELECT completed_at, score INTO v_already_completed, v_existing_score
  FROM public.quiz_attempts
  WHERE id = p_attempt_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quiz attempt % tapılmadı', p_attempt_id;
  END IF;

  IF v_already_completed IS NOT NULL THEN
    -- Check if quiz_results exists; if not, insert it!
    SELECT id INTO v_result_id FROM public.quiz_results WHERE attempt_id = p_attempt_id LIMIT 1;
    
    IF v_result_id IS NULL THEN
      INSERT INTO public.quiz_results (
        attempt_id,
        quiz_id,
        user_id,
        score,
        total_questions,
        percentage,
        time_spent,
        completed_at
      ) VALUES (
        p_attempt_id,
        p_quiz_id,
        p_user_id,
        COALESCE(v_existing_score, p_score),
        COALESCE(p_total_questions, 0),
        COALESCE(v_existing_score, p_score),
        p_time_spent,
        v_already_completed
      )
      ON CONFLICT (attempt_id) DO UPDATE SET
        score = EXCLUDED.score,
        percentage = EXCLUDED.percentage,
        time_spent = EXCLUDED.time_spent
      RETURNING id INTO v_result_id;
    END IF;

    RETURN jsonb_build_object(
      'status', 'already_completed',
      'attempt_id', p_attempt_id,
      'result_id', v_result_id,
      'score', COALESCE(v_existing_score, p_score)
    );
  END IF;

  -- 1. Update quiz_attempts
  UPDATE public.quiz_attempts
  SET 
    completed_at = NOW(),
    score = p_score,
    total_questions = COALESCE(p_total_questions, total_questions),
    time_spent = p_time_spent,
    answers = p_answers
  WHERE id = p_attempt_id;

  -- 2. Upsert into quiz_results (now works reliably with standard unique constraint)
  INSERT INTO public.quiz_results (
    attempt_id,
    quiz_id,
    user_id,
    score,
    total_questions,
    percentage,
    time_spent,
    completed_at
  ) VALUES (
    p_attempt_id,
    p_quiz_id,
    p_user_id,
    p_score,
    p_total_questions,
    p_score,
    p_time_spent,
    NOW()
  )
  ON CONFLICT (attempt_id) DO UPDATE SET
    score = EXCLUDED.score,
    percentage = EXCLUDED.percentage,
    time_spent = EXCLUDED.time_spent
  RETURNING id INTO v_result_id;

  -- 3. Atomically increment quiz play count without lost updates
  UPDATE public.quizzes
  SET play_count = COALESCE(play_count, 0) + 1
  WHERE id = p_quiz_id;

  RETURN jsonb_build_object(
    'status', 'success',
    'attempt_id', p_attempt_id,
    'result_id', v_result_id,
    'score', p_score
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_quiz_attempt_atomic(UUID, UUID, UUID, INTEGER, INTEGER, INTEGER, JSONB) TO authenticated, service_role;

-- 3. Backfill any completed quiz_attempts that were missing quiz_results rows
INSERT INTO public.quiz_results (
  attempt_id,
  quiz_id,
  user_id,
  score,
  total_questions,
  percentage,
  time_spent,
  completed_at
)
SELECT 
  qa.id,
  qa.quiz_id,
  qa.user_id,
  COALESCE(qa.score, 0),
  COALESCE(qa.total_questions, 0),
  COALESCE(qa.score, 0),
  qa.time_spent,
  qa.completed_at
FROM public.quiz_attempts qa
LEFT JOIN public.quiz_results qr ON qr.attempt_id = qa.id
WHERE qa.completed_at IS NOT NULL 
  AND qr.id IS NULL
  AND qa.score IS NOT NULL
ON CONFLICT (attempt_id) DO NOTHING;

-- 4. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
