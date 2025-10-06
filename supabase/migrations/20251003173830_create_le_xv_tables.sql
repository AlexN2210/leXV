/*
  # Création de la base de données pour Le XV Food Truck

  1. Nouvelles Tables
    - `menu_categories`
      - `id` (uuid, clé primaire)
      - `nom` (text) - Nom de la catégorie
      - `ordre` (integer) - Ordre d'affichage
      - `created_at` (timestamptz)
    
    - `menu_items`
      - `id` (uuid, clé primaire)
      - `category_id` (uuid, référence menu_categories)
      - `nom` (text) - Nom du plat
      - `description` (text) - Description du plat
      - `prix` (decimal) - Prix en euros
      - `image_url` (text, optionnel) - URL de l'image du plat
      - `disponible` (boolean) - Si le plat est disponible
      - `ordre` (integer) - Ordre d'affichage dans la catégorie
      - `created_at` (timestamptz)
    
    - `arrets`
      - `id` (uuid, clé primaire)
      - `nom` (text) - Nom de l'emplacement
      - `adresse` (text) - Adresse complète
      - `latitude` (decimal) - Latitude GPS
      - `longitude` (decimal) - Longitude GPS
      - `jour` (text) - Jour de la semaine
      - `horaire_debut` (time) - Heure de début
      - `horaire_fin` (time) - Heure de fin
      - `actif` (boolean) - Si l'arrêt est actif
      - `created_at` (timestamptz)
    
    - `commandes`
      - `id` (uuid, clé primaire)
      - `arret_id` (uuid, référence arrets)
      - `client_nom` (text) - Nom du client
      - `client_telephone` (text) - Téléphone du client
      - `client_email` (text) - Email du client
      - `date_retrait` (date) - Date de retrait
      - `heure_retrait` (time) - Heure de retrait
      - `statut` (text) - Statut de la commande (en_attente, en_preparation, prete, recuperee, annulee)
      - `montant_total` (decimal) - Montant total de la commande
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `commande_items`
      - `id` (uuid, clé primaire)
      - `commande_id` (uuid, référence commandes)
      - `menu_item_id` (uuid, référence menu_items)
      - `quantite` (integer) - Quantité commandée
      - `prix_unitaire` (decimal) - Prix unitaire au moment de la commande
      - `created_at` (timestamptz)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques pour lecture publique sur menu_categories, menu_items, arrets
    - Politiques pour création publique sur commandes et commande_items
    - Politiques admin pour modification complète (authentifiés uniquement)
*/

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

-- Activer RLS sur toutes les tables
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE arrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE commande_items ENABLE ROW LEVEL SECURITY;

-- Politiques pour menu_categories (lecture publique, modification admin)
CREATE POLICY "Lecture publique des catégories"
  ON menu_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin peut modifier les catégories"
  ON menu_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiques pour menu_items (lecture publique, modification admin)
CREATE POLICY "Lecture publique des items du menu"
  ON menu_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin peut modifier les items du menu"
  ON menu_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiques pour arrets (lecture publique, modification admin)
CREATE POLICY "Lecture publique des arrêts"
  ON arrets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin peut modifier les arrêts"
  ON arrets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiques pour commandes (création publique, lecture/modification admin)
CREATE POLICY "Création publique des commandes"
  ON commandes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin peut lire toutes les commandes"
  ON commandes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin peut modifier les commandes"
  ON commandes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin peut supprimer les commandes"
  ON commandes FOR DELETE
  TO authenticated
  USING (true);

-- Politiques pour commande_items (création publique, lecture/modification admin)
CREATE POLICY "Création publique des items de commande"
  ON commande_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin peut lire tous les items de commande"
  ON commande_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin peut modifier les items de commande"
  ON commande_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insertion de données initiales pour les catégories
INSERT INTO menu_categories (nom, ordre) VALUES
  ('Burgers', 1),
  ('Snacks', 2),
  ('Boissons', 3),
  ('Desserts', 4)
ON CONFLICT DO NOTHING;

-- Insertion de quelques items de menu exemple
INSERT INTO menu_items (category_id, nom, description, prix, ordre) 
SELECT 
  (SELECT id FROM menu_categories WHERE nom = 'Burgers'),
  'Le XV Classic',
  'Burger maison avec steak haché, cheddar, salade, tomate, oignons',
  9.50,
  1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE nom = 'Le XV Classic');

INSERT INTO menu_items (category_id, nom, description, prix, ordre) 
SELECT 
  (SELECT id FROM menu_categories WHERE nom = 'Burgers'),
  'Le XV Bacon',
  'Burger avec bacon croustillant, cheddar, sauce BBQ',
  10.50,
  2
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE nom = 'Le XV Bacon');

INSERT INTO menu_items (category_id, nom, description, prix, ordre) 
SELECT 
  (SELECT id FROM menu_categories WHERE nom = 'Snacks'),
  'Frites Maison',
  'Frites fraîches coupées et cuites sur place',
  3.50,
  1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE nom = 'Frites Maison');

INSERT INTO menu_items (category_id, nom, description, prix, ordre) 
SELECT 
  (SELECT id FROM menu_categories WHERE nom = 'Boissons'),
  'Coca-Cola',
  'Canette 33cl',
  2.50,
  1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE nom = 'Coca-Cola');

-- Insertion d'arrêts exemple
INSERT INTO arrets (nom, adresse, latitude, longitude, jour, horaire_debut, horaire_fin) 
VALUES
  ('Place de la Mairie', '1 Place de la Mairie, 75001 Paris', 48.8566, 2.3522, 'Lundi', '12:00', '14:00'),
  ('Parc des Expositions', '15 Avenue du Parc, 75015 Paris', 48.8420, 2.2870, 'Mardi', '12:00', '14:00'),
  ('Zone Industrielle', '20 Rue de l''Industrie, 75013 Paris', 48.8292, 2.3686, 'Mercredi', '12:00', '14:00')
ON CONFLICT DO NOTHING;