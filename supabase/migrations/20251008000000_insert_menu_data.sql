-- Insertion des catégories du menu
INSERT INTO menu_categories (nom, ordre) VALUES
  ('Snacks', 1),
  ('Formules', 2),
  ('Menu Kids', 3),
  ('Dessert', 4),
  ('Boissons', 5)
ON CONFLICT DO NOTHING;

-- Récupérer les IDs des catégories
DO $$
DECLARE
  snacks_id UUID;
  formules_id UUID;
  menu_kids_id UUID;
  dessert_id UUID;
  boissons_id UUID;
BEGIN
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
    (snacks_id, 'Frites fraîches', '', 3.00, true, 4);

  -- Insertion des plats - Formules
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (formules_id, '4 Tenders "Maison" + Frites + Boisson', '', 12.00, true, 1),
    (formules_id, '2 Hauts de cuisse frits "Mariné maison" + Frites + Boisson', '', 12.00, true, 2),
    (formules_id, '6 Chicken drumsticks + Frites + Boisson', '', 12.00, true, 3),
    (formules_id, 'Boîte Mix', '4 Tenders + 2 Hauts de cuisse + 6 Chicken drumsticks', 20.00, true, 4),
    (formules_id, 'Supplément viande', '', 4.00, true, 5);

  -- Insertion des plats - Menu Kids
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (menu_kids_id, 'La boîte à LILY', '2 Tenders + Frites + POM''POTE + Capri-Sun + Cadeau surprise', 8.00, true, 1);

  -- Insertion des plats - Dessert
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (dessert_id, 'Beignet long pomme ou chocolat', '', 3.00, true, 1);

  -- Insertion des plats - Boissons
  INSERT INTO menu_items (category_id, nom, description, prix, disponible, ordre) VALUES
    (boissons_id, 'Canette de soda 33cl', '', 2.00, true, 1),
    (boissons_id, 'Bouteille d''eau 50cl', 'Plate ou gazeuse', 1.50, true, 2);
END $$;

-- Mise à jour des arrêts
INSERT INTO arrets (nom, adresse, latitude, longitude, jour, horaire_debut, horaire_fin, actif) VALUES
  ('Place du marché aux raisins', 'Villeveynac', 43.50103759765625, 3.602396249771118, 'Mardi', '18:00', '22:00', true),
  ('Place du marché aux raisins', 'Villeveynac', 43.50103759765625, 3.602396249771118, 'Jeudi', '18:00', '22:00', true),
  ('Complexe sportif des Baux', 'Poussan', 43.4827231, 3.6569117, 'Mercredi', '18:00', '22:00', true),
  ('Complexe sportif des Baux', 'Poussan', 43.4827231, 3.6569117, 'Vendredi', '18:00', '22:00', true)
ON CONFLICT DO NOTHING;

