-- ============================================
-- SCRIPT COMPLET D'INITIALISATION DE LA BDD
-- ============================================

-- 1. CRÉATION DES TABLES
-- ============================================

-- Table des catégories de menu
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des items du menu
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  nom text NOT NULL,
  description text,
  prix decimal(10,2) NOT NULL,
  image_url text,
  disponible boolean DEFAULT true,
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des arrêts du food truck
CREATE TABLE IF NOT EXISTS arrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  adresse text NOT NULL,
  latitude decimal(10,8) NOT NULL,
  longitude decimal(11,8) NOT NULL,
  jour text NOT NULL,
  horaire_debut time NOT NULL,
  horaire_fin time NOT NULL,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS commandes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  arret_id uuid REFERENCES arrets(id) ON DELETE SET NULL,
  client_nom text NOT NULL,
  client_telephone text NOT NULL,
  client_email text,
  date_retrait date NOT NULL,
  heure_retrait time NOT NULL,
  statut text NOT NULL DEFAULT 'en_attente',
  montant_total decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des items de commande
CREATE TABLE IF NOT EXISTS commande_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id uuid REFERENCES commandes(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  quantite integer NOT NULL,
  prix_unitaire decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. ACTIVATION DE LA SÉCURITÉ RLS
-- ============================================

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE arrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE commande_items ENABLE ROW LEVEL SECURITY;

-- 3. POLITIQUES DE SÉCURITÉ
-- ============================================

-- Politiques pour menu_categories
DROP POLICY IF EXISTS "Lecture publique des catégories" ON menu_categories;
CREATE POLICY "Lecture publique des catégories"
  ON menu_categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin peut modifier les catégories" ON menu_categories;
CREATE POLICY "Admin peut modifier les catégories"
  ON menu_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiques pour menu_items
DROP POLICY IF EXISTS "Lecture publique des items du menu" ON menu_items;
CREATE POLICY "Lecture publique des items du menu"
  ON menu_items FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin peut modifier les items du menu" ON menu_items;
CREATE POLICY "Admin peut modifier les items du menu"
  ON menu_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiques pour arrets
DROP POLICY IF EXISTS "Lecture publique des arrêts" ON arrets;
CREATE POLICY "Lecture publique des arrêts"
  ON arrets FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin peut modifier les arrêts" ON arrets;
CREATE POLICY "Admin peut modifier les arrêts"
  ON arrets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiques pour commandes
DROP POLICY IF EXISTS "Création publique des commandes" ON commandes;
CREATE POLICY "Création publique des commandes"
  ON commandes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin peut lire toutes les commandes" ON commandes;
CREATE POLICY "Admin peut lire toutes les commandes"
  ON commandes FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin peut modifier les commandes" ON commandes;
CREATE POLICY "Admin peut modifier les commandes"
  ON commandes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin peut supprimer les commandes" ON commandes;
CREATE POLICY "Admin peut supprimer les commandes"
  ON commandes FOR DELETE
  TO authenticated
  USING (true);

-- Politiques pour commande_items
DROP POLICY IF EXISTS "Création publique des items de commande" ON commande_items;
CREATE POLICY "Création publique des items de commande"
  ON commande_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin peut lire tous les items de commande" ON commande_items;
CREATE POLICY "Admin peut lire tous les items de commande"
  ON commande_items FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin peut modifier les items de commande" ON commande_items;
CREATE POLICY "Admin peut modifier les items de commande"
  ON commande_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. SUPPRESSION DES DONNÉES EXISTANTES (OPTIONNEL)
-- ============================================
-- Décommenter si vous voulez repartir de zéro
-- DELETE FROM commande_items;
-- DELETE FROM commandes;
-- DELETE FROM menu_items;
-- DELETE FROM arrets;
-- DELETE FROM menu_categories;

-- 5. INSERTION DES CATÉGORIES DU MENU
-- ============================================

INSERT INTO menu_categories (nom, ordre) VALUES
  ('Snacks', 1),
  ('Formules', 2),
  ('Menu Kids', 3),
  ('Dessert', 4),
  ('Boissons', 5)
ON CONFLICT DO NOTHING;

-- 6. INSERTION DES PLATS DU MENU
-- ============================================

DO $$
DECLARE
  snacks_id UUID;
  formules_id UUID;
  menu_kids_id UUID;
  dessert_id UUID;
  boissons_id UUID;
BEGIN
  -- Récupérer les IDs des catégories
  SELECT id INTO snacks_id FROM menu_categories WHERE nom = 'Snacks';
  SELECT id INTO formules_id FROM menu_categories WHERE nom = 'Formules';
  SELECT id INTO menu_kids_id FROM menu_categories WHERE nom = 'Menu Kids';
  SELECT id INTO dessert_id FROM menu_categories WHERE nom = 'Dessert';
  SELECT id INTO boissons_id FROM menu_categories WHERE nom = 'Boissons';

  -- Insertion des plats - Snacks
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (snacks_id, 'Cornet d''oignons frits', 'Maison', 3.00, true, 1),
    (snacks_id, 'Galette de pomme de terre', 'Pièce', 3.00, true, 2),
    (snacks_id, 'Beignet d''aubergine', 'Pièce', 3.00, true, 3),
    (snacks_id, 'Frites fraîches', '', 3.00, true, 4)
  ON CONFLICT DO NOTHING;

  -- Insertion des plats - Formules
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (formules_id, '4 Tenders "Maison" + Frites + Boisson', '', 12.00, true, 1),
    (formules_id, '2 Hauts de cuisse frits "Mariné maison" + Frites + Boisson', '', 12.00, true, 2),
    (formules_id, '6 Chicken drumsticks + Frites + Boisson', '', 12.00, true, 3),
    (formules_id, 'Boîte Mix', '4 Tenders + 2 Hauts de cuisse + 6 Chicken drumsticks', 20.00, true, 4),
    (formules_id, 'Supplément viande', '', 4.00, true, 5)
  ON CONFLICT DO NOTHING;

  -- Insertion des plats - Menu Kids
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (menu_kids_id, 'La boîte à LILY', '2 Tenders + Frites + POM''POTE + Capri-Sun + Cadeau surprise', 8.00, true, 1)
  ON CONFLICT DO NOTHING;

  -- Insertion des plats - Dessert
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (dessert_id, 'Beignet long pomme ou chocolat', '', 3.00, true, 1)
  ON CONFLICT DO NOTHING;

  -- Insertion des plats - Boissons
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (boissons_id, 'Canette de soda 33cl', '', 2.00, true, 1),
    (boissons_id, 'Bouteille d''eau 50cl', 'Plate ou gazeuse', 1.50, true, 2)
  ON CONFLICT DO NOTHING;
END $$;

-- 7. INSERTION DES ARRÊTS (EMPLACEMENTS)
-- ============================================

INSERT INTO arrets (nom, adresse, latitude, longitude, jour, horaire_debut, horaire_fin, actif) VALUES
  ('Place du marché aux raisins', 'Villeveynac', 43.50103759765625, 3.602396249771118, 'Mardi', '18:00', '22:00', true),
  ('Place du marché aux raisins', 'Villeveynac', 43.50103759765625, 3.602396249771118, 'Jeudi', '18:00', '22:00', true),
  ('Complexe sportif des Baux', 'Poussan', 43.4827231, 3.6569117, 'Mercredi', '18:00', '22:00', true),
  ('Complexe sportif des Baux', 'Poussan', 43.4827231, 3.6569117, 'Vendredi', '18:00', '22:00', true)
ON CONFLICT DO NOTHING;

