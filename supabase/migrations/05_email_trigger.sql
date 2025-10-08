-- Fonction pour envoyer un email de confirmation de commande
CREATE OR REPLACE FUNCTION send_commande_confirmation_email()
RETURNS TRIGGER AS $$
DECLARE
  arret_info RECORD;
  items_list TEXT := '';
  item RECORD;
BEGIN
  -- Récupérer les informations de l'arrêt
  SELECT nom, adresse INTO arret_info
  FROM arrets
  WHERE id = NEW.arret_id;

  -- Construire la liste des articles
  FOR item IN 
    SELECT mi.nom, ci.quantite, ci.prix_unitaire
    FROM commande_items ci
    JOIN menu_items mi ON mi.id = ci.menu_item_id
    WHERE ci.commande_id = NEW.id
  LOOP
    items_list := items_list || item.quantite || 'x ' || item.nom || ' - ' || (item.quantite * item.prix_unitaire)::numeric(10,2) || '€' || E'\n';
  END LOOP;

  -- Envoyer l'email via Supabase Auth
  -- Note: Supabase envoie automatiquement via son service d'email
  PERFORM auth.send_email(
    NEW.client_email,
    'Confirmation de votre commande - Le XV Food Truck',
    '
    <h1>Commande Confirmée !</h1>
    <p>Bonjour ' || NEW.client_nom || ',</p>
    <p>Votre commande a bien été enregistrée. Voici le récapitulatif :</p>
    
    <h2>Informations de retrait</h2>
    <ul>
      <li><strong>Lieu :</strong> ' || arret_info.nom || ' - ' || arret_info.adresse || '</li>
      <li><strong>Date :</strong> ' || TO_CHAR(NEW.date_retrait, 'DD/MM/YYYY') || '</li>
      <li><strong>Heure :</strong> ' || NEW.heure_retrait || '</li>
    </ul>

    <h2>Articles commandés</h2>
    <pre>' || items_list || '</pre>

    <h2>Total : ' || NEW.montant_total::numeric(10,2) || '€</h2>

    <p>Numéro de commande : <strong>' || SUBSTRING(NEW.id::text, 1, 8) || '</strong></p>
    
    <hr>
    <p>Nous vous contacterons par téléphone quand votre commande sera prête.</p>
    <p><strong>Contact :</strong> 06 85 84 30 20</p>
    
    <p>Merci de votre confiance !<br>L''équipe du XV</p>
    '
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_commande_created ON commandes;
CREATE TRIGGER on_commande_created
  AFTER INSERT ON commandes
  FOR EACH ROW
  WHEN (NEW.client_email IS NOT NULL AND NEW.client_email != '')
  EXECUTE FUNCTION send_commande_confirmation_email();

