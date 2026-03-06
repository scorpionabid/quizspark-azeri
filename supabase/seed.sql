-- Seed users with EXPLICIT column values for created_at, updated_at, and all critical string fields.
-- This fixes the GoTrue Scan error by ensuring no NULL values are returned for timestamps during user lookup.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clear everything first
DELETE FROM auth.users WHERE email IN ('admin@test.az', 'teacher@test.az', 'student@test.az', 'talali-admin@quiz.app');

-- Common IDs for consistent seeding
-- Admin: a0000000-0000-0000-0000-000000000001
-- Teacher: b0000000-0000-0000-0000-000000000002
-- Student: c0000000-0000-0000-0000-000000000003
-- Main Admin: d0000000-0000-0000-0000-000000000004


-- Admin User
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, 
  created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, 
  email_change_token_current, phone_change_token, reauthentication_token, is_sso_user
) VALUES (
  'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@test.az', crypt('password123', gen_salt('bf')), 
  now(), now(), '{}', '{"full_name":"Baş Admin","role":"admin"}', false, 
  now(), now(), '', '', '', '', '', '', false
);

-- Teacher User
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, 
  created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, 
  email_change_token_current, phone_change_token, reauthentication_token, is_sso_user
) VALUES (
  'b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teacher@test.az', crypt('password123', gen_salt('bf')), 
  now(), now(), '{}', '{"full_name":"Müəllim Həsənov","role":"teacher"}', false, 
  now(), now(), '', '', '', '', '', '', false
);

-- Student User
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, 
  created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, 
  email_change_token_current, phone_change_token, reauthentication_token, is_sso_user
) VALUES (
  'c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student@test.az', crypt('password123', gen_salt('bf')), 
  now(), now(), '{}', '{"full_name":"Tələbə Məmmədov","role":"student"}', false, 
  now(), now(), '', '', '', '', '', '', false
);

-- Main Admin (talalı-admin)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, 
  created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, 
  email_change_token_current, phone_change_token, reauthentication_token, is_sso_user
) VALUES (
  'd0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'talali-admin@quiz.app', crypt('Admin123!', gen_salt('bf')), 
  now(), now(), '{}', '{"full_name":"Talıbov Admin","role":"admin"}', false, 
  now(), now(), '', '', '', '', '', '', false
);

-- Assign roles and update profiles
DO $$
BEGIN
  -- Admin
  UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
  UPDATE public.profiles SET status = 'active', is_profile_complete = true WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
  
  -- Student
  UPDATE public.user_roles SET role = 'student' WHERE user_id = 'c0000000-0000-0000-0000-000000000003';
  UPDATE public.profiles SET status = 'active', is_profile_complete = true WHERE user_id = 'c0000000-0000-0000-0000-000000000003';

  -- Teacher
  UPDATE public.user_roles SET role = 'teacher' WHERE user_id = 'b0000000-0000-0000-0000-000000000002';
  UPDATE public.profiles SET status = 'pending', is_profile_complete = true WHERE user_id = 'b0000000-0000-0000-0000-000000000002';

  -- Main Admin
  UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'd0000000-0000-0000-0000-000000000004';
  UPDATE public.profiles SET status = 'active', is_profile_complete = true WHERE user_id = 'd0000000-0000-0000-0000-000000000004';
END $$;

-- Seed Categories
INSERT INTO public.question_categories (name, description)
VALUES 
  ('Riyaziyyat', 'Cəbr, həndəsə və riyazi analiz sualları'),
  ('Tarix', 'Azərbaycan və dünya tarixi sualları'),
  ('İnformatika', 'Proqramlaşdırma və IT sualları');

-- Seed Sample Questions
INSERT INTO public.question_bank (user_id, question_text, question_type, options, correct_answer, explanation, category, difficulty)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Supabase hansı verilənlər bazası üzərində qurulub?', 'multiple_choice', '["MySQL", "PostgreSQL", "MongoDB", "SQLite"]', 'PostgreSQL', 'Supabase açıq qaynaqlı PostgreSQL üzərində qurulub.', 'İnformatika', 'asan'),
  ('a0000000-0000-0000-0000-000000000001', 'Azərbaycanın paytaxtı haradır?', 'multiple_choice', '["Gəncə", "Bakı", "Sumqayıt", "Naxçıvan"]', 'Bakı', 'Azərbaycan Respublikasının paytaxtı Bakı şəhəridir.', 'Tarix', 'asan'),
  ('a0000000-0000-0000-0000-000000000001', 'E = mc² düsturu kimə aiddir?', 'multiple_choice', '["Newton", "Einstein", "Tesla", "Bohr"]', 'Einstein', 'Kütlə-enerji ekvivalentliyi düsturu Albert Einstein tərəfindən irəli sürülmüşdür.', 'İnformatika', 'orta');

-- Seed Default AI Config
INSERT INTO public.ai_config (id, default_provider_id, default_model_id, is_enabled, global_daily_limit)
VALUES (gen_random_uuid(), NULL, NULL, true, 1000);
