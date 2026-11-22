-- Performance Indexes & RLS Optimization Migration
-- Date: 2026-09-14
-- Purpose: Optimize 300+ concurrent participant exam operations, eliminate seq scans, in-memory sorts, and redundant RLS subplans.

-- 1. Quizzes: Fast specialty & exam category lookup (eliminates Sequential Scan)
CREATE INDEX IF NOT EXISTS idx_quizzes_specialty_exam 
ON public.quizzes (specialty_key, exam_category);

-- 2. Quiz Attempts: Fast monitoring & session history by quiz and started_at
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_started 
ON public.quiz_attempts (quiz_id, started_at DESC);

-- 3. Quiz Attempts: Partial index for active in-progress attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_active_sessions 
ON public.quiz_attempts (quiz_id) 
WHERE completed_at IS NULL;

-- 4. Quiz Results: Leaderboards & score ranking composite index
CREATE INDEX IF NOT EXISTS idx_quiz_results_ranking 
ON public.quiz_results (quiz_id, percentage DESC, time_spent ASC);

-- 5. Audit Logs: Fast candidate log filtering by entity_id
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_created 
ON public.audit_logs (entity_id, created_at DESC);

-- 6. Clean redundant duplicate RLS policy on questions (covered by 'Creators can manage their quiz questions' ALL policy)
DROP POLICY IF EXISTS "Creators can view their quiz questions" ON public.questions;

-- 7. Analyze affected tables to refresh planner statistics immediately
ANALYZE public.quizzes;
ANALYZE public.questions;
ANALYZE public.quiz_attempts;
ANALYZE public.quiz_results;
ANALYZE public.audit_logs;
