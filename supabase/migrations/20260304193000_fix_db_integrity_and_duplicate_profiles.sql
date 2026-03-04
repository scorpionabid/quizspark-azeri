-- Migration: Fix Database Integrity and Cleanup Orphan Profiles
-- Description: Merges duplicate profiles, cleans up orphaned data, and adds Foreign Key constraints with CASCADE.

DO $$ 
DECLARE
    table_data RECORD;
BEGIN
    -- 1. Metadata Merging
    -- If an orphan profile (one NOT in auth.users) has a name but the active profile (one IN auth.users) doesn't, copy it over.
    UPDATE public.profiles p
    SET 
        full_name = COALESCE(NULLIF(p.full_name, ''), orphan.full_name),
        phone = COALESCE(NULLIF(p.phone, ''), orphan.phone),
        is_profile_complete = TRUE
    FROM public.profiles orphan
    WHERE p.email = orphan.email
    AND p.user_id IN (SELECT id FROM auth.users)
    AND orphan.user_id NOT IN (SELECT id FROM auth.users);

    -- 2. Data Re-assignment
    -- Re-assign records from orphan user_ids to active user_ids for the same email.
    FOR table_data IN 
        SELECT p.user_id as active_id, orphan.user_id as orphan_id
        FROM public.profiles p
        JOIN public.profiles orphan ON p.email = orphan.email
        WHERE p.user_id IN (SELECT id FROM auth.users)
        AND orphan.user_id NOT IN (SELECT id FROM auth.users)
    LOOP
        -- Re-assign in known tables
        UPDATE public.question_bank SET user_id = table_data.active_id WHERE user_id = table_data.orphan_id;
        UPDATE public.quizzes SET creator_id = table_data.active_id WHERE creator_id = table_data.orphan_id;
        
        -- Other tables (using dynamic SQL to avoid errors if tables don't exist yet)
        BEGIN EXECUTE 'UPDATE public.quiz_results SET user_id = $1 WHERE user_id = $2' USING table_data.active_id, table_data.orphan_id; EXCEPTION WHEN OTHERS THEN END;
        BEGIN EXECUTE 'UPDATE public.quiz_attempts SET user_id = $1 WHERE user_id = $2' USING table_data.active_id, table_data.orphan_id; EXCEPTION WHEN OTHERS THEN END;
    END LOOP;

    -- 3. Cleanup Orphans
    -- Remove profiles and roles that have no corresponding record in auth.users
    DELETE FROM public.user_roles WHERE user_id NOT IN (SELECT id FROM auth.users);
    DELETE FROM public.profiles WHERE user_id NOT IN (SELECT id FROM auth.users);

    -- 4. Integrity Reinforcement (Foreign Keys with CASCADE)
    -- Profiles
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Roles
    ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Quizzes
    ALTER TABLE public.quizzes DROP CONSTRAINT IF EXISTS quizzes_creator_id_fkey;
    ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Question Bank
    ALTER TABLE public.question_bank DROP CONSTRAINT IF EXISTS question_bank_user_id_fkey;
    ALTER TABLE public.question_bank ADD CONSTRAINT question_bank_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;
