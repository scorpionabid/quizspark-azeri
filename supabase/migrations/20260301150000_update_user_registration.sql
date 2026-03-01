-- Drop the temporary trigger we created earlier if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_registration ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_registration();

-- Modify the existing handle_new_user function to store more metadata and handle roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    initial_role public.app_role;
    raw_role TEXT;
BEGIN
    -- 1. Create Profile
    INSERT INTO public.profiles (user_id, full_name, phone)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone'
    );

    -- 2. Extract role from metadata
    raw_role := NEW.raw_user_meta_data->>'role';
    
    -- Default to student if not specified
    IF raw_role = 'teacher' THEN
        initial_role := 'teacher';
    ELSE
        initial_role := 'student';
    END IF;

    -- 3. Assign Role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, initial_role);

    -- 4. If teacher, we can mark as pending if we had a status column.
    -- For now, the user_roles and profiles are enough. 
    -- The admin can manage them in /admin/users.

    RETURN NEW;
END;
$$;
