-- ==============================================================================
-- Migration: Create audit_logs and system_error_logs tables
-- Description: Centralized audit trail and frontend/system error telemetry
-- ==============================================================================

-- 1. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'ROLE_CHANGE', 'PERMISSION_CHANGE', 'SETTINGS_CHANGE', 'AUTH', 'BULK_ACTION'
    entity_type TEXT NOT NULL, -- 'quiz', 'question', 'category', 'user', 'role', 'permission', 'ai_config', 'system'
    entity_id TEXT,
    description TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs
-- Admins can read all audit logs
CREATE POLICY "Admins can view all audit logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Authenticated users can insert audit records
CREATE POLICY "Authenticated users can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);


-- 2. Create system_error_logs table
CREATE TABLE IF NOT EXISTS public.system_error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    error_type TEXT NOT NULL, -- 'runtime_error', 'api_error', 'network_error', 'unhandled_rejection', 'component_crash'
    message TEXT NOT NULL,
    stack_trace TEXT,
    component_name TEXT,
    url_path TEXT NOT NULL,
    device_info JSONB, -- { os, browser, screen, is_online, connection }
    severity TEXT NOT NULL DEFAULT 'error', -- 'critical', 'error', 'warning'
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for system_error_logs
CREATE INDEX IF NOT EXISTS idx_system_error_logs_severity ON public.system_error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_system_error_logs_resolved ON public.system_error_logs(is_resolved);
CREATE INDEX IF NOT EXISTS idx_system_error_logs_created_at ON public.system_error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_error_logs_url_path ON public.system_error_logs(url_path);

-- Enable RLS for system_error_logs
ALTER TABLE public.system_error_logs ENABLE ROW LEVEL SECURITY;

-- Policies for system_error_logs
-- Admins can view and update system error logs
CREATE POLICY "Admins can view all system error logs"
    ON public.system_error_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

CREATE POLICY "Admins can update system error logs"
    ON public.system_error_logs
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Any user (including anonymous for startup errors) can insert error logs
CREATE POLICY "Anyone can report error logs"
    ON public.system_error_logs
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
