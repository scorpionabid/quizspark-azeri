-- 1. Add monitoring & resiliency columns to quiz_attempts
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS last_heartbeat_at timestamp with time zone;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS current_question_index integer DEFAULT 0;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS tab_switch_count integer DEFAULT 0;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS user_agent text;

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_completed ON quiz_attempts(quiz_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_heartbeat ON quiz_attempts(last_heartbeat_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action_time ON audit_logs(user_id, action, created_at DESC);

-- 3. Create lightweight heartbeat RPC function
CREATE OR REPLACE FUNCTION record_exam_heartbeat(
  p_attempt_id uuid,
  p_question_index integer,
  p_tab_switches integer DEFAULT 0,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE quiz_attempts
  SET
    last_heartbeat_at = now(),
    current_question_index = COALESCE(p_question_index, current_question_index),
    tab_switch_count = GREATEST(tab_switch_count, p_tab_switches),
    ip_address = COALESCE(p_ip_address, ip_address),
    user_agent = COALESCE(p_user_agent, user_agent)
  WHERE id = p_attempt_id
    AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
END;
$$;

GRANT EXECUTE ON FUNCTION record_exam_heartbeat TO authenticated;
