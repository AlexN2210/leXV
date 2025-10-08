CREATE TABLE IF NOT EXISTS demandes_contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  type_evenement text NOT NULL,
  date_evenement date,
  nombre_personnes integer,
  lieu text,
  message text,
  statut text NOT NULL DEFAULT 'nouvelle',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE demandes_contact ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Création publique des demandes de contact" ON demandes_contact;
CREATE POLICY "Création publique des demandes de contact"
  ON demandes_contact FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin peut lire les demandes de contact" ON demandes_contact;
CREATE POLICY "Admin peut lire les demandes de contact"
  ON demandes_contact FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin peut modifier les demandes de contact" ON demandes_contact;
CREATE POLICY "Admin peut modifier les demandes de contact"
  ON demandes_contact FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin peut supprimer les demandes de contact" ON demandes_contact;
CREATE POLICY "Admin peut supprimer les demandes de contact"
  ON demandes_contact FOR DELETE
  TO authenticated
  USING (true);

