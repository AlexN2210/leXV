-- Migration pour ajouter la colonne client_prenom à la table commandes
-- Date: 2025-01-27

-- Ajouter la colonne client_prenom
ALTER TABLE commandes 
ADD COLUMN client_prenom TEXT;

-- Mettre à jour les commandes existantes avec une valeur par défaut
-- (optionnel, selon vos besoins)
UPDATE commandes 
SET client_prenom = 'Non renseigné' 
WHERE client_prenom IS NULL;

-- Ajouter un commentaire sur la colonne
COMMENT ON COLUMN commandes.client_prenom IS 'Prénom du client qui passe la commande';
