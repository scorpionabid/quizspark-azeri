-- Migration: Fix OAuth Role Selection and Teacher Approval
-- 1. Correctly assign student or teacher roles during select_oauth_role
-- 2. Allow admins to securely approve teachers (setting role='teacher' and status='active')

CREATE OR REPLACE FUNCTION public.select_oauth_role(p_role text, p_phone text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate role value
    IF p_role NOT IN ('student', 'teacher') THEN
        RAISE EXCEPTION 'Invalid role: %', p_role;
    END IF;

    -- Update user role properly based on selection
    IF p_role = 'student' THEN
        -- Student: immediate active status, student role, profile completed
        UPDATE public.user_roles
        SET role = 'student'::app_role
        WHERE user_id = auth.uid();

        UPDATE public.profiles
        SET
            status = 'active',
            phone = COALESCE(p_phone, phone),
            is_profile_complete = true
        WHERE user_id = auth.uid();

    ELSIF p_role = 'teacher' THEN
        -- Teacher: teacher role with pending status, awaiting admin approval
        UPDATE public.user_roles
        SET role = 'teacher'::app_role
        WHERE user_id = auth.uid();

        UPDATE public.profiles
        SET
            status = 'pending',
            phone = COALESCE(p_phone, phone),
            is_profile_complete = true
        WHERE user_id = auth.uid();
    END IF;
END;
$$;

-- Function for Admins to approve pending teachers in a single atomic call
CREATE OR REPLACE FUNCTION public.admin_approve_teacher(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Security check: Caller must be admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only admins can approve teacher accounts.';
    END IF;

    -- 1. Ensure user role is set to teacher
    UPDATE public.user_roles
    SET role = 'teacher'::app_role
    WHERE user_id = p_user_id;

    -- 2. Set profile status to active
    UPDATE public.profiles
    SET status = 'active'
    WHERE user_id = p_user_id;
END;
$$;
