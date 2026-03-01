-- Add email column to profiles for easier admin management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update handle_new_user to copy email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    initial_role public.app_role;
    initial_status TEXT;
    raw_role TEXT;
BEGIN
    -- Extract role from metadata
    raw_role := NEW.raw_user_meta_data->>'role';
    
    -- Logic for Teacher vs Student
    IF raw_role = 'teacher' THEN
        initial_role := 'teacher';
        initial_status := 'pending';
    ELSE
        initial_role := 'student';
        initial_status := 'active';
    END IF;

    -- 1. Create Profile with status and email
    INSERT INTO public.profiles (user_id, full_name, phone, status, email)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone',
        initial_status,
        NEW.email
    );

    -- 2. Assign Role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, initial_role);

    RETURN NEW;
END;
$$;
