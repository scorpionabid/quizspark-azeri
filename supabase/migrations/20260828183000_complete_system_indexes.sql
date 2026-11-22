-- 1. Support messages indexes for chat performance
CREATE INDEX IF NOT EXISTS idx_support_messages_sender ON public.support_messages (sender_id, created_at);
CREATE INDEX IF NOT EXISTS idx_support_messages_receiver ON public.support_messages (receiver_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_support_messages_conversation ON public.support_messages (sender_id, receiver_id, created_at);

-- 2. User history & profile performance indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_started ON public.quiz_attempts (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_completed ON public.quiz_results (user_id, completed_at DESC);

-- 3. Question categories performance indexes
CREATE INDEX IF NOT EXISTS idx_question_categories_user_name ON public.question_categories (user_id, name ASC);
CREATE INDEX IF NOT EXISTS idx_question_categories_parent ON public.question_categories (parent_id) WHERE parent_id IS NOT NULL;

-- 4. Foreign key indexes to speed up joins and cascading checks
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON public.role_permissions (permission_id);
CREATE INDEX IF NOT EXISTS idx_question_ratings_bank ON public.question_ratings (question_bank_id);
CREATE INDEX IF NOT EXISTS idx_question_ratings_quiz_question ON public.question_ratings (quiz_question_id);
CREATE INDEX IF NOT EXISTS idx_ai_models_provider ON public.ai_models (provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_aliases_model ON public.ai_model_aliases (model_id);
CREATE INDEX IF NOT EXISTS idx_ai_config_provider ON public.ai_config (default_provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_config_model ON public.ai_config (default_model_id);
