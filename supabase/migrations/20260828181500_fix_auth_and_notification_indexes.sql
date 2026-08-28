-- Fix missing indexes on notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, read) WHERE read = false;

-- Fix user_roles index and policies for ultra-fast auth checks
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles (user_id, role);

-- Ensure profiles user_id fast lookup
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);
