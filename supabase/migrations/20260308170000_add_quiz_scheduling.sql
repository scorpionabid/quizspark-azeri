-- Add scheduling and timing bonus/penalty fields to quizzes
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS available_from TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS available_to TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_bonus_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS time_penalty_enabled BOOLEAN DEFAULT FALSE;

-- Add comments for clarity
COMMENT ON COLUMN public.quizzes.available_from IS 'The date and time when the quiz becomes available to students';
COMMENT ON COLUMN public.quizzes.available_to IS 'The date and time when the quiz expires and is no longer accessible';
COMMENT ON COLUMN public.quizzes.time_bonus_enabled IS 'Whether to award extra XP for quick answers';
COMMENT ON COLUMN public.quizzes.time_penalty_enabled IS 'Whether to deduct total time for incorrect answers';
