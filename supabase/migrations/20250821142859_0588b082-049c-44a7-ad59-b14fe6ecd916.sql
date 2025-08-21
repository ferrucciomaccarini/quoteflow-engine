-- Create demo user profile (the auth user will be created through signup)
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