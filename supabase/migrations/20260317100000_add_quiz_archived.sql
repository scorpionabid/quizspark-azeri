-- Add is_archived flag to quizzes for soft-archiving without deletion
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for efficient filtering by archived status
CREATE INDEX IF NOT EXISTS idx_quizzes_is_archived ON quizzes (is_archived);

-- Ensure existing quizzes are treated as non-archived
UPDATE quizzes SET is_archived = FALSE WHERE is_archived IS NULL;
