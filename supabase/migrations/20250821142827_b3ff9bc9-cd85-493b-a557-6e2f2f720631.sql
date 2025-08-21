-- Create demo user profile
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'demo@pmix.it',
  crypt('DemoUser2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Utente Demo"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('DemoUser2024!', gen_salt('bf')),
  raw_user_meta_data = '{"name": "Utente Demo"}',
  updated_at = now();

-- Ensure demo profile exists
INSERT INTO public.profiles (id, name, email, role, company_id, company_name)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Utente Demo',
  'demo@pmix.it',
  'owner',
  '0',
  'Pmix Demo Company'
) ON CONFLICT (id) DO UPDATE SET
  name = 'Utente Demo',
  email = 'demo@pmix.it',
  role = 'owner',
  company_name = 'Pmix Demo Company',
  updated_at = now();