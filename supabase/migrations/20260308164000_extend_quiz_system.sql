-- Extend quizzes table with new settings
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS shuffle_questions BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_feedback BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS pass_percentage INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS attempts_limit INTEGER DEFAULT 1;

-- Extend questions table with more control fields
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS weight DECIMAL DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS time_limit INTEGER, -- in seconds
ADD COLUMN IF NOT EXISTS hint TEXT;

-- Add informative comments
COMMENT ON COLUMN public.quizzes.shuffle_questions IS 'Whether to randomize question order for each attempt';
COMMENT ON COLUMN public.quizzes.show_feedback IS 'Whether to show correct answers and explanations after attempt';
COMMENT ON COLUMN public.quizzes.pass_percentage IS 'Percentage required to pass the quiz (0-100)';
COMMENT ON COLUMN public.quizzes.cover_image_url IS 'URL of the quiz cover image';
COMMENT ON COLUMN public.quizzes.attempts_limit IS 'Maximum number of attempts allowed per user';

COMMENT ON COLUMN public.questions.weight IS 'Weight/Points for this specific question';
COMMENT ON COLUMN public.questions.time_limit IS 'Time limit for this specific question in seconds';
COMMENT ON COLUMN public.questions.hint IS 'Small hint to help user answer the question';
