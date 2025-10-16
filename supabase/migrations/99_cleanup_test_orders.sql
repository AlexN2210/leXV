-- Script de nettoyage des commandes de test
-- Ce script supprime toutes les commandes de test créées pendant le développement

-- Supprimer les commandes de test (celles avec "Test" dans le nom)
DELETE FROM commande_items 
WHERE commande_id IN (
  SELECT id FROM commandes 
  WHERE client_nom LIKE '%Test%' 
  OR client_nom LIKE '%test%'
  OR client_email = 'test@example.com'
  OR client_telephone = '0600000000'
);

-- Supprimer les commandes de test
DELETE FROM commandes 
WHERE client_nom LIKE '%Test%' 
OR client_nom LIKE '%test%'
OR client_email = 'test@example.com'
OR client_telephone = '0600000000';

-- Afficher le nombre de commandes restantes
SELECT COUNT(*) as commandes_restantes FROM commandes;

-- Afficher les commandes restantes (pour vérification)
SELECT 
  id,
  client_nom,
  client_telephone,
  client_email,
  montant_total,
  statut,
  created_at
FROM commandes 
ORDER BY created_at DESC;
