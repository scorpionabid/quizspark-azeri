-- Add auto_advance setting to quizzes
-- When true: quiz auto-advances to next question after answer (using question time_limit or 1.5s)
-- When false: student must manually click "Növbəti" button
ALTER TABLE quizzes
  ADD COLUMN IF NOT EXISTS auto_advance boolean DEFAULT false;
