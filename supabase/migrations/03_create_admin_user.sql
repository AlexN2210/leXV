-- Créer un utilisateur admin par défaut
-- Email: admin@lexv.fr
-- Mot de passe: AdminLeXV2025!

-- Note: Ce script utilise les fonctions internes de Supabase Auth
-- Pour créer l'utilisateur admin, exécutez ce SQL dans votre dashboard Supabase

-- IMPORTANT: Changez le mot de passe après la première connexion !

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@lexv.fr',
  crypt('AdminLeXV2025!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Créer une entrée dans auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  id,
  format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
  'email',
  NOW(),
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@lexv.fr'
ON CONFLICT DO NOTHING;

