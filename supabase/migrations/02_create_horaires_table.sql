CREATE TABLE IF NOT EXISTS horaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jour text NOT NULL UNIQUE,
  horaire_debut time NOT NULL,
  horaire_fin time NOT NULL,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE horaires ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des horaires" ON horaires;
CREATE POLICY "Lecture publique des horaires"
  ON horaires FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin peut modifier les horaires" ON horaires;
CREATE POLICY "Admin peut modifier les horaires"
  ON horaires FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO horaires (jour, horaire_debut, horaire_fin, actif) VALUES
  ('Lundi', '18:00', '22:00', false),
  ('Mardi', '18:00', '22:00', true),
  ('Mercredi', '18:00', '22:00', true),
  ('Jeudi', '18:00', '22:00', true),
  ('Vendredi', '18:00', '22:00', true),
  ('Samedi', '18:00', '22:00', false),
  ('Dimanche', '18:00', '22:00', false)
ON CONFLICT (jour) DO NOTHING;


