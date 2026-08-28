-- Add feedback_timing to quizzes table
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS feedback_timing text DEFAULT 'end_of_quiz';
