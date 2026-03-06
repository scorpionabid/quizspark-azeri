-- Seed users with EXPLICIT column values for created_at, updated_at, and all critical string fields.
-- This fixes the GoTrue Scan error by ensuring no NULL values are returned for timestamps during user lookup.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clear everything first
DELETE FROM auth.users WHERE email IN ('admin@test.az', 'teacher@test.az', 'student@test.az', 'talali-admin@quiz.app');

-- Admin User (a0000000-0000-0000-0000-000000000001)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
  recovery_token, recovery_sent_at, email_change_token_new, email_change, 
  email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, 
  is_super_admin, created_at, updated_at, phone, phone_confirmed_at, 
  phone_change, phone_change_token, phone_change_sent_at,
  email_change_token_current, banned_until, 
  reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@test.az', crypt('password123', gen_salt('bf')), 
  now(), NULL, '', NULL, '', NULL, '', '', NULL, now(), '{}', '{"full_name":"Baş Admin","role":"admin"}', 
  false, now(), now(), NULL, NULL, '', '', NULL, '', NULL, '', NULL, false, NULL, false
);

-- Teacher User (b0000000-0000-0000-0000-000000000002)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
  recovery_token, recovery_sent_at, email_change_token_new, email_change, 
  email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, 
  is_super_admin, created_at, updated_at, phone, phone_confirmed_at, 
  phone_change, phone_change_token, phone_change_sent_at,
  email_change_token_current, banned_until, 
  reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'teacher@test.az', crypt('password123', gen_salt('bf')), 
  now(), NULL, '', NULL, '', NULL, '', '', NULL, now(), '{}', '{"full_name":"Müəllim Həsənov","role":"teacher"}', 
  false, now(), now(), NULL, NULL, '', '', NULL, '', NULL, '', NULL, false, NULL, false
);

-- Student User (c0000000-0000-0000-0000-000000000003)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
  recovery_token, recovery_sent_at, email_change_token_new, email_change, 
  email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, 
  is_super_admin, created_at, updated_at, phone, phone_confirmed_at, 
  phone_change, phone_change_token, phone_change_sent_at,
  email_change_token_current, banned_until, 
  reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000', 'c0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'student@test.az', crypt('password123', gen_salt('bf')), 
  now(), NULL, '', NULL, '', NULL, '', '', NULL, now(), '{}', '{"full_name":"Tələbə Məmmədov","role":"student"}', 
  false, now(), now(), NULL, NULL, '', '', NULL, '', NULL, '', NULL, false, NULL, false
);

-- Main Admin (talalı-admin)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
  recovery_token, recovery_sent_at, email_change_token_new, email_change, 
  email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, 
  is_super_admin, created_at, updated_at, phone, phone_confirmed_at, 
  phone_change, phone_change_token, phone_change_sent_at,
  email_change_token_current, banned_until, 
  reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000', 'd0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'talali-admin@quiz.app', crypt('Admin123!', gen_salt('bf')), 
  now(), NULL, '', NULL, '', NULL, '', '', NULL, now(), '{}', '{"full_name":"Talıbov Admin","role":"admin"}', 
  false, now(), now(), '', NULL, '', '', NULL, '', NULL, '', NULL, false, NULL, false
);

-- Assign roles and update profiles in public schema
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
END;
$$;
