-- Migration: 20261108043000_atomic_quiz_completion_and_time_sync.sql
-- Purpose:
-- 1. Add attempt_id to quiz_results with unique constraint to prevent duplicate leaderboard rows on rapid / concurrent submit.
-- 2. Add atomic stored procedure complete_quiz_attempt_atomic for race-condition-safe completion and atomic play_count increment.
-- 3. Add get_current_server_time() function for client-server clock synchronization.

-- 1. Add attempt_id column and unique index
ALTER TABLE public.quiz_results 
ADD COLUMN IF NOT EXISTS attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_quiz_results_attempt 
ON public.quiz_results (attempt_id) 
WHERE attempt_id IS NOT NULL;

-- 2. Current server time function for timer synchronization
CREATE OR REPLACE FUNCTION public.get_current_server_time()
RETURNS TIMESTAMPTZ
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT NOW();
$$;

GRANT EXECUTE ON FUNCTION public.get_current_server_time() TO anon, authenticated, service_role;

-- 3. Atomic attempt completion RPC
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
    -- Already completed by a previous concurrent call; return idempotently
    SELECT id INTO v_result_id FROM public.quiz_results WHERE attempt_id = p_attempt_id LIMIT 1;
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

  -- 2. Upsert into quiz_results
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
