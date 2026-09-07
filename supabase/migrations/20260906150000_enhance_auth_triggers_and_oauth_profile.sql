-- Migration: Enhance handle_new_user trigger for Google OAuth and metadata extraction
-- Extracts full_name or name, avatar_url or picture, and handles role/profile completeness

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
    extracted_name TEXT;
    extracted_avatar TEXT;
BEGIN
    -- 1. Extract Role from Metadata
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
        -- Default for OAuth without metadata role: student, profile marked incomplete
        initial_role := 'student';
        initial_status := 'active';
        is_complete := false;
    END IF;

    -- 2. Extract Name (Google sends 'name', custom form sends 'full_name')
    extracted_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
        NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
        'İstifadəçi'
    );

    -- 3. Extract Avatar (Google sends 'picture', Supabase sends 'avatar_url')
    extracted_avatar := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), '')
    );

    -- 4. Create or update profile
    INSERT INTO public.profiles (
        user_id,
        full_name,
        avatar_url,
        phone,
        status,
        email,
        is_profile_complete
    )
    VALUES (
        NEW.id,
        extracted_name,
        extracted_avatar,
        NEW.raw_user_meta_data->>'phone',
        initial_status,
        NEW.email,
        is_complete
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
        full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
        avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
        email = COALESCE(profiles.email, EXCLUDED.email);

    -- 5. Assign Role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, initial_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$;
