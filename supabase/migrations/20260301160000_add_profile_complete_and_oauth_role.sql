-- Add is_profile_complete column to profiles
-- false for OAuth users (no role in metadata), true for email/password signups
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_profile_complete boolean NOT NULL DEFAULT true;

-- Update handle_new_user trigger to set is_profile_complete based on whether role metadata exists.
-- OAuth users don't pass a 'role' in metadata → is_profile_complete = false
-- Email/password signups always pass 'role' → is_profile_complete = true
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    initial_role public.app_role;
    initial_status TEXT;
    is_complete BOOLEAN;
    raw_role TEXT;
BEGIN
    -- Extract role from metadata (only present for email/password signups)
    raw_role := NEW.raw_user_meta_data->>'role';

    IF raw_role = 'teacher' THEN
        initial_role := 'teacher';
        initial_status := 'pending';
        is_complete := true;
    ELSIF raw_role = 'student' THEN
        initial_role := 'student';
        initial_status := 'active';
        is_complete := true;
    ELSE
        -- OAuth signup: no role in metadata → student by default, profile not complete
        initial_role := 'student';
        initial_status := 'active';
        is_complete := false;
    END IF;

    -- Create Profile
    INSERT INTO public.profiles (user_id, full_name, phone, status, email, is_profile_complete)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone',
        initial_status,
        NEW.email,
        is_complete
    );

    -- Assign Role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, initial_role);

    RETURN NEW;
END;
$$;

-- RPC function allowing OAuth users to select their role after first login.
-- SECURITY DEFINER runs with elevated privileges to update user_roles.
CREATE OR REPLACE FUNCTION public.select_oauth_role(p_role text)
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

    -- Update user role
    UPDATE public.user_roles
    SET role = p_role::app_role
    WHERE user_id = auth.uid();

    -- Update profile: set status and mark profile complete
    UPDATE public.profiles
    SET
        status = CASE WHEN p_role = 'teacher' THEN 'pending' ELSE 'active' END,
        is_profile_complete = true
    WHERE user_id = auth.uid();
END;
$$;
