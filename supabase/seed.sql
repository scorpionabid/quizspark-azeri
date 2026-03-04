-- Final fix for seed.sql to satisfy strict GoTrue struct scanning
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Delete any existing test users to avoid conflict
DELETE FROM auth.users WHERE email IN ('admin@test.az', 'teacher@test.az', 'student@test.az');

-- Admin
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
  recovery_token, recovery_sent_at, email_change_token_new, email_change_sent_at, 
  last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, 
  created_at, updated_at, phone, phone_confirmed_at, phone_change, 
  phone_change_token, phone_change_sent_at, email_change_token_current, 
  email_change_confirm_status, banned_until, reauthentication_token, 
  reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous
) VALUES (
  'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@test.az', crypt('password123', gen_salt('bf')), 
  now(), NULL, '', NULL, 
  '', NULL, '', NULL, 
  now(), '{}', '{"full_name":"Baş Admin","role":"admin"}', false, 
  now(), now(), NULL, NULL, NULL, 
  '', NULL, '', 
  0, NULL, '', 
  NULL, false, NULL, false
);

-- Teacher
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
  recovery_token, recovery_sent_at, email_change_token_new, email_change_sent_at, 
  last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, 
  created_at, updated_at, phone, phone_confirmed_at, phone_change, 
  phone_change_token, phone_change_sent_at, email_change_token_current, 
  email_change_confirm_status, banned_until, reauthentication_token, 
  reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous
) VALUES (
  'b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teacher@test.az', crypt('password123', gen_salt('bf')), 
  now(), NULL, '', NULL, 
  '', NULL, '', NULL, 
  now(), '{}', '{"full_name":"Müəllim Həsənov","role":"teacher"}', false, 
  now(), now(), NULL, NULL, NULL, 
  '', NULL, '', 
  0, NULL, '', 
  NULL, false, NULL, false
);

-- Student
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
  recovery_token, recovery_sent_at, email_change_token_new, email_change_sent_at, 
  last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, 
  created_at, updated_at, phone, phone_confirmed_at, phone_change, 
  phone_change_token, phone_change_sent_at, email_change_token_current, 
  email_change_confirm_status, banned_until, reauthentication_token, 
  reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous
) VALUES (
  'c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student@test.az', crypt('password123', gen_salt('bf')), 
  now(), NULL, '', NULL, 
  '', NULL, '', NULL, 
  now(), '{}', '{"full_name":"Tələbə Məmmədov","role":"student"}', false, 
  now(), now(), NULL, NULL, NULL, 
  '', NULL, '', 
  0, NULL, '', 
  NULL, false, NULL, false
);

-- Assign roles manually
DO $$
BEGIN
  -- Admin
  UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
  UPDATE public.profiles SET status = 'active', is_profile_complete = true WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
  
  -- Student
  UPDATE public.profiles SET status = 'active', is_profile_complete = true WHERE user_id = 'c0000000-0000-0000-0000-000000000003';
END $$;
