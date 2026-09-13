-- Official Exam and Candidate Support (FIN + Specialty)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fin text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty text;
CREATE INDEX IF NOT EXISTS idx_profiles_fin ON profiles(fin);

ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS exam_category text;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS specialty_key text;
CREATE INDEX IF NOT EXISTS idx_quizzes_specialty_key ON quizzes(specialty_key);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view all quiz attempts' AND polrelid = 'quiz_attempts'::regclass) THEN
    CREATE POLICY "Admins can view all quiz attempts" ON quiz_attempts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    initial_role public.app_role;
    initial_status TEXT;
    is_complete BOOLEAN;
    raw_role TEXT;
    extracted_name TEXT;
    extracted_avatar TEXT;
BEGIN
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
        initial_role := 'student';
        initial_status := 'active';
        is_complete := false;
    END IF;

    extracted_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
        NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
        'İstifadəçi'
    );

    extracted_avatar := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), '')
    );

    INSERT INTO public.profiles (
        user_id,
        full_name,
        avatar_url,
        phone,
        fin,
        specialty,
        status,
        email,
        is_profile_complete
    )
    VALUES (
        NEW.id,
        extracted_name,
        extracted_avatar,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'fin',
        NEW.raw_user_meta_data->>'specialty',
        initial_status,
        NEW.email,
        is_complete
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
        fin = COALESCE(EXCLUDED.fin, profiles.fin),
        specialty = COALESCE(EXCLUDED.specialty, profiles.specialty),
        email = COALESCE(profiles.email, EXCLUDED.email);

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, initial_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
