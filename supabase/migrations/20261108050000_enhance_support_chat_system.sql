-- Migration: 20261108050000_enhance_support_chat_system.sql
-- Purpose:
-- 1. Provide get_support_admin_id() to dynamically route messages to real active admins.
-- 2. Enhance get_admin_conversations() so any admin can view all support messages and see user email & role.
-- 3. Provide get_user_unread_support_count() for user notification badges.

-- 1. Dynamic Support Admin ID resolver
CREATE OR REPLACE FUNCTION public.get_support_admin_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Find primary active admin from user_roles
  SELECT user_id INTO v_admin_id
  FROM public.user_roles
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1;

  -- Fallback hardcoded if needed
  IF v_admin_id IS NULL THEN
    v_admin_id := '81cebd9d-586b-4460-8615-6cb0ed9d1094'::UUID;
  END IF;

  RETURN v_admin_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_support_admin_id() TO anon, authenticated, service_role;

-- 2. Enhanced Admin Conversations function (drop old signature first)
DROP FUNCTION IF EXISTS public.get_admin_conversations();

CREATE OR REPLACE FUNCTION public.get_admin_conversations()
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    role TEXT,
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    unread_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only admins can call this function
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'İcazə verilmədi: Yalnız adminlər müraciətləri görə bilər';
    END IF;

    RETURN QUERY
    WITH ranked_messages AS (
        SELECT 
            m.id,
            m.sender_id,
            m.receiver_id,
            m.content,
            m.is_read,
            m.created_at,
            CASE 
                WHEN has_role(m.sender_id, 'admin'::app_role) THEN m.receiver_id
                ELSE m.sender_id
            END AS other_user_id
        FROM public.support_messages m
    ),
    last_messages AS (
        SELECT DISTINCT ON (rm.other_user_id)
            rm.other_user_id,
            rm.content AS last_message,
            rm.created_at AS last_message_at
        FROM ranked_messages rm
        WHERE rm.other_user_id IS NOT NULL
        ORDER BY rm.other_user_id, rm.created_at DESC
    ),
    unread_counts AS (
        SELECT 
            rm.sender_id AS other_user_id,
            COUNT(*) AS unread_count
        FROM public.support_messages rm
        WHERE rm.is_read = FALSE 
          AND (has_role(rm.receiver_id, 'admin'::app_role) OR rm.receiver_id IS NOT NULL)
          AND NOT has_role(rm.sender_id, 'admin'::app_role)
        GROUP BY rm.sender_id
    )
    SELECT 
        p.user_id,
        COALESCE(p.full_name, 'İstifadəçi') AS full_name,
        p.avatar_url,
        COALESCE(p.email, u.email, '')::TEXT AS email,
        COALESCE(ur.role::text, 'student')::TEXT AS role,
        lm.last_message,
        lm.last_message_at,
        COALESCE(uc.unread_count, 0::bigint) AS unread_count
    FROM last_messages lm
    JOIN public.profiles p ON p.user_id = lm.other_user_id
    LEFT JOIN auth.users u ON u.id = p.user_id
    LEFT JOIN public.user_roles ur ON ur.user_id = p.user_id
    LEFT JOIN unread_counts uc ON uc.other_user_id = p.user_id
    ORDER BY lm.last_message_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_conversations() TO authenticated, service_role;

-- 3. Unread support count for users
CREATE OR REPLACE FUNCTION public.get_user_unread_support_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.support_messages
  WHERE receiver_id = auth.uid()
    AND is_read = FALSE;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_unread_support_count() TO authenticated, service_role;
