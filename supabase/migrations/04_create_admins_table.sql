CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  nom text,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins peuvent lire tous les admins" ON admins;
CREATE POLICY "Admins peuvent lire tous les admins"
  ON admins FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins peuvent gérer les admins" ON admins;
CREATE POLICY "Admins peuvent gérer les admins"
  ON admins FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO admins (email, password_hash, nom, actif) VALUES
  ('admin@lexv.fr', crypt('AdminLeXV2025!', gen_salt('bf')), 'Admin Principal', true)
ON CONFLICT (email) DO NOTHING;

