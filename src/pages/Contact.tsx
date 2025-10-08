import { useState } from 'react';
import { Mail, CheckCircle, Calendar, Users, PartyPopper } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    typeEvenement: '',
    dateEvenement: '',
    nombrePersonnes: '',
    lieu: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const typesEvenements = [
    'Anniversaire',
    'Mariage',
    'Événement d\'entreprise',
    'Festival',
    'Marché',
    'Événement sportif',
    'Autre',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('demandes_contact')
        .insert([{
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          type_evenement: formData.typeEvenement,
          date_evenement: formData.dateEvenement || null,
          nombre_personnes: formData.nombrePersonnes ? parseInt(formData.nombrePersonnes) : null,
          lieu: formData.lieu,
          message: formData.message,
          statut: 'nouvelle',
        }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        typeEvenement: '',
        dateEvenement: '',
        nombrePersonnes: '',
        lieu: '',
        message: '',
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle size={80} className="mx-auto mb-6 text-green-600" />
          <h2 className="text-4xl font-bold mb-4">Demande Envoyée !</h2>
          <p className="text-xl text-gray-600 mb-8">
            Nous avons bien reçu votre demande. Nous vous contacterons dans les plus brefs délais pour discuter de votre événement.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Nouvelle Demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <PartyPopper size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact & Événements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vous organisez un événement ? Anniversaire, mariage, festival, marché ? 
            Le XV Food Truck se déplace pour faire de votre événement un moment inoubliable !
          </p>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center border-4 border-black p-6">
            <Calendar size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Flexibilité</h3>
            <p className="text-gray-600">
              Nous nous adaptons à vos dates et horaires
            </p>
          </div>
          <div className="text-center border-4 border-black p-6">
            <Users size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Capacité</h3>
            <p className="text-gray-600">
              De 20 à 500 personnes et plus
            </p>
          </div>
          <div className="text-center border-4 border-black p-6">
            <PartyPopper size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Expérience</h3>
            <p className="text-gray-600">
              Une cuisine de qualité pour vos invités
            </p>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="border-4 border-black p-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Mail size={32} />
            Demande de Devis
          </h2>
          <p className="text-gray-600 mb-8">
            Remplissez ce formulaire et nous vous recontacterons rapidement pour discuter de votre projet.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full border-2 border-black p-3"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full border-2 border-black p-3"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-black p-3"
              />
            </div>

            {/* Informations sur l'événement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Type d'événement *</label>
                <select
                  required
                  value={formData.typeEvenement}
                  onChange={(e) => setFormData({ ...formData, typeEvenement: e.target.value })}
                  className="w-full border-2 border-black p-3"
                >
                  <option value="">Sélectionnez un type</option>
                  {typesEvenements.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Date souhaitée</label>
                <input
                  type="date"
                  value={formData.dateEvenement}
                  onChange={(e) => setFormData({ ...formData, dateEvenement: e.target.value })}
                  className="w-full border-2 border-black p-3"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Nombre de personnes (estimation)</label>
                <input
                  type="number"
                  value={formData.nombrePersonnes}
                  onChange={(e) => setFormData({ ...formData, nombrePersonnes: e.target.value })}
                  className="w-full border-2 border-black p-3"
                  min="1"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Lieu de l'événement</label>
                <input
                  type="text"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  className="w-full border-2 border-black p-3"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Votre message / Détails de la demande</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border-2 border-black p-3"
                rows={5}
                placeholder="Décrivez-nous votre événement, vos besoins spécifiques, etc."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-4 text-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer ma Demande'}
            </button>
          </form>

          <div className="mt-8 bg-blue-50 border-2 border-blue-300 p-6">
            <h3 className="font-bold text-lg mb-3">📞 Vous préférez nous appeler ?</h3>
            <p className="text-gray-700 mb-2">
              <strong>Téléphone :</strong> 06 85 84 30 20
            </p>
            <p className="text-gray-700">
              <strong>Email :</strong> stevelexv@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

