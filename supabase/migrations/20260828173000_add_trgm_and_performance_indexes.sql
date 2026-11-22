-- Enable pg_trgm for fast ILIKE text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram GIN indexes for lightning fast text searching
CREATE INDEX IF NOT EXISTS idx_quizzes_title_trgm ON public.quizzes USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_quizzes_description_trgm ON public.quizzes USING gin (description gin_trgm_ops) WHERE description IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_questions_text_trgm ON public.questions USING gin (question_text gin_trgm_ops);

-- Partial index for active public catalog (tiny footprint, 100% in RAM)
CREATE INDEX IF NOT EXISTS idx_quizzes_active_catalog ON public.quizzes (subject, difficulty, duration, created_at DESC)
WHERE is_published = true AND is_public = true AND is_archived = false;

-- Composite Indexes for subject filtering + sorting
CREATE INDEX IF NOT EXISTS idx_quizzes_subject_plays ON public.quizzes (subject, play_count DESC)
WHERE is_published = true AND is_public = true AND is_archived = false;

CREATE INDEX IF NOT EXISTS idx_quizzes_subject_created ON public.quizzes (subject, created_at DESC)
WHERE is_published = true AND is_public = true AND is_archived = false;

CREATE INDEX IF NOT EXISTS idx_quizzes_subject_questions ON public.quizzes (subject, question_count DESC)
WHERE is_published = true AND is_public = true AND is_archived = false;
