import emailjs from '@emailjs/browser';
import jsPDF from 'jspdf';

// Configuration EmailJS
// Pour activer, créez un compte sur https://www.emailjs.com/
// Et remplacez ces valeurs par vos propres clés
const EMAILJS_SERVICE_ID = 'service_lexv';
const EMAILJS_TEMPLATE_ID = 'template_commande';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';

interface CommandeEmail {
  clientPrenom: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  lieu: string;
  jour: string;
  dateRetrait: string;
  heureRetrait: string;
  articles: Array<{ nom: string; quantite: number; prix: number }>;
  total: number;
  numeroCommande: string;
}

export const envoyerEmailConfirmation = async (commande: CommandeEmail): Promise<boolean> => {
  // Si pas d'email client, on ne peut pas envoyer
  if (!commande.clientEmail) {
    console.log('Pas d\'email fourni par le client');
    return false;
  }

  try {
    // Formater la liste des articles
    const articlesListe = commande.articles
      .map(a => `${a.quantite}x ${a.nom} - ${(a.quantite * a.prix).toFixed(2)}€`)
      .join('\n');

    const templateParams = {
      client_prenom: commande.clientPrenom,
      client_nom: commande.clientNom,
      client_email: commande.clientEmail,
      client_telephone: commande.clientTelephone,
      lieu_retrait: commande.lieu,
      jour_retrait: commande.jour,
      date_retrait: new Date(commande.dateRetrait).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      heure_retrait: commande.heureRetrait,
      articles_liste: articlesListe,
      montant_total: commande.total.toFixed(2),
      numero_commande: commande.numeroCommande,
    };

    // Pour l'instant, on simule l'envoi en affichant dans la console
    // Une fois configuré avec EmailJS, décommentez la ligne suivante :
    // await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
    
    console.log('📧 Email qui serait envoyé:', templateParams);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};

// Alternative simple : Afficher un récapitulatif imprimable
export const genererRecapitulatifCommande = (commande: CommandeEmail): string => {
  const articlesListe = commande.articles
    .map(a => `• ${a.quantite}x ${a.nom} - ${(a.quantite * a.prix).toFixed(2)}€`)
    .join('\n');

  return `
═══════════════════════════════════════
         LE XV - FOOD TRUCK
═══════════════════════════════════════

RÉCAPITULATIF DE VOTRE COMMANDE

Numéro de commande: ${commande.numeroCommande}

─────────────────────────────────────

CLIENT
Prénom: ${commande.clientPrenom}
Nom: ${commande.clientNom}
Téléphone: ${commande.clientTelephone}
${commande.clientEmail ? `Email: ${commande.clientEmail}` : ''}

─────────────────────────────────────

RETRAIT
Lieu: ${commande.lieu}
Jour: ${commande.jour}
Date: ${new Date(commande.dateRetrait).toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
Heure: ${commande.heureRetrait}

─────────────────────────────────────

ARTICLES COMMANDÉS

${articlesListe}

─────────────────────────────────────

TOTAL: ${commande.total.toFixed(2)}€

═══════════════════════════════════════

Merci pour votre commande !
Nous préparons vos plats avec soin.

Contact: 06 85 84 30 20
═══════════════════════════════════════
  `.trim();
};

// Générer et télécharger un PDF du récapitulatif
export const telechargerRecapitulatifPDF = (commande: CommandeEmail) => {
  const doc = new jsPDF();
  
  // Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Titre
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LE XV', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  
  doc.setFontSize(16);
  doc.text('FOOD TRUCK', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Titre récapitulatif
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉCAPITULATIF DE COMMANDE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${commande.numeroCommande}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Informations client
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS CLIENT', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Prénom: ${commande.clientPrenom}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Nom: ${commande.clientNom}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Téléphone: ${commande.clientTelephone}`, margin, yPosition);
  yPosition += 5;
  if (commande.clientEmail) {
    doc.text(`Email: ${commande.clientEmail}`, margin, yPosition);
    yPosition += 5;
  }
  yPosition += 5;

  // Informations de retrait
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS DE RETRAIT', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Lieu: ${commande.lieu}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Jour: ${commande.jour}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date(commande.dateRetrait).toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Heure: ${commande.heureRetrait}`, margin, yPosition);
  yPosition += 10;

  // Articles commandés
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ARTICLES COMMANDÉS', margin, yPosition);
  yPosition += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  commande.articles.forEach(article => {
    const ligne = `${article.quantite}x ${article.nom}`;
    const prix = `${(article.quantite * article.prix).toFixed(2)}€`;
    doc.text(ligne, margin, yPosition);
    doc.text(prix, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 6;
  });

  yPosition += 5;
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 7;

  // Total
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', margin, yPosition);
  doc.text(`${commande.total.toFixed(2)}€`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Message de remerciement
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Merci pour votre commande !', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text('Nous vous contacterons quand votre commande sera prête.', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  doc.text('Contact: 06 85 84 30 20', pageWidth / 2, yPosition, { align: 'center' });

  // Télécharger le PDF
  doc.save(`Commande_LeXV_${commande.numeroCommande}.pdf`);
};


