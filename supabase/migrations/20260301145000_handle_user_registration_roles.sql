-- Handle nested JSON role and status during registration
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
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

  -- Insert into profiles (using the extracted role/status if needed, though profiles doesn't have status yet)
  -- If you want to store status in profiles, you'll need to add it first.
  -- For now, let's just use the role in user_roles for access control.
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, initial_role);

  -- Update profiles with the role-specific info if necessary
  -- Profiles are usually created by another trigger or during signup. 
  -- In this project, it seems profiles are created. Let's ensure role is respected.
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created_registration ON auth.users;
CREATE TRIGGER on_auth_user_created_registration
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();
