import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Commande {
  id: string;
  montant_total: number;
  statut: string;
  created_at: string;
  date_retrait: string;
}

export const Financier = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);
  const [periode, setPeriode] = useState<'jour' | 'semaine' | 'mois' | 'annee'>('mois');

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('commandes')
        .select('id, montant_total, statut, created_at, date_retrait')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommandes(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculs des statistiques
  const commandesValidees = commandes.filter(c => c.statut !== 'annulee');
  const chiffreAffaireTotal = commandesValidees.reduce((sum, c) => sum + c.montant_total, 0);
  const nombreCommandesTotal = commandesValidees.length;
  const panierMoyen = nombreCommandesTotal > 0 ? chiffreAffaireTotal / nombreCommandesTotal : 0;

  // Statistiques par statut
  const commandesParStatut = [
    { name: 'En Attente', value: commandes.filter(c => c.statut === 'en_attente').length, color: '#fbbf24' },
    { name: 'En Préparation', value: commandes.filter(c => c.statut === 'en_preparation').length, color: '#3b82f6' },
    { name: 'Prête', value: commandes.filter(c => c.statut === 'prete').length, color: '#10b981' },
    { name: 'Récupérée', value: commandes.filter(c => c.statut === 'recuperee').length, color: '#6b7280' },
    { name: 'Annulée', value: commandes.filter(c => c.statut === 'annulee').length, color: '#ef4444' },
  ];

  // Chiffre d'affaires par jour (derniers 7 jours)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const caParJour = getLast7Days().map(date => {
    const commandesJour = commandesValidees.filter(c => 
      c.created_at.split('T')[0] === date
    );
    const total = commandesJour.reduce((sum, c) => sum + c.montant_total, 0);
    const dateObj = new Date(date);
    return {
      date: dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      montant: total,
      commandes: commandesJour.length
    };
  });

  // CA par mois (derniers 6 mois)
  const getLast6Months = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      });
    }
    return months;
  };

  const caParMois = getLast6Months().map(({ year, month, label }) => {
    const commandesMois = commandesValidees.filter(c => {
      const date = new Date(c.created_at);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
    const total = commandesMois.reduce((sum, c) => sum + c.montant_total, 0);
    return {
      mois: label,
      montant: total,
      commandes: commandesMois.length
    };
  });

  if (loading) {
    return <div className="text-center py-20">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Cards de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-4 border-black p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Chiffre d'Affaires</h3>
            <DollarSign size={32} className="text-green-600" />
          </div>
          <p className="text-4xl font-bold text-green-700">{chiffreAffaireTotal.toFixed(2)}€</p>
          <p className="text-sm text-gray-600 mt-2">Total (hors annulations)</p>
        </div>

        <div className="border-4 border-black p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Commandes</h3>
            <ShoppingBag size={32} className="text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-blue-700">{nombreCommandesTotal}</p>
          <p className="text-sm text-gray-600 mt-2">Commandes validées</p>
        </div>

        <div className="border-4 border-black p-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Panier Moyen</h3>
            <TrendingUp size={32} className="text-orange-600" />
          </div>
          <p className="text-4xl font-bold text-orange-700">{panierMoyen.toFixed(2)}€</p>
          <p className="text-sm text-gray-600 mt-2">Par commande</p>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setPeriode('jour')}
          className={`px-4 py-2 font-semibold border-2 ${
            periode === 'jour' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          7 Derniers Jours
        </button>
        <button
          onClick={() => setPeriode('mois')}
          className={`px-4 py-2 font-semibold border-2 ${
            periode === 'mois' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          6 Derniers Mois
        </button>
      </div>

      {/* Graphique CA par période */}
      <div className="border-4 border-black p-6 bg-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calendar size={28} />
          {periode === 'jour' ? 'Chiffre d\'Affaires - 7 Derniers Jours' : 'Chiffre d\'Affaires - 6 Derniers Mois'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={periode === 'jour' ? caParJour : caParMois}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={periode === 'jour' ? 'date' : 'mois'} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(2)}€`}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar dataKey="montant" name="Montant" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique évolution */}
      <div className="border-4 border-black p-6 bg-white">
        <h3 className="text-2xl font-bold mb-6">📈 Évolution du Chiffre d'Affaires</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={periode === 'jour' ? caParJour : caParMois}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={periode === 'jour' ? 'date' : 'mois'} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(2)}€`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="montant" 
              name="CA" 
              stroke="#000000" 
              strokeWidth={3}
              dot={{ fill: '#000000', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Répartition par statut */}
      <div className="border-4 border-black p-6 bg-white">
        <h3 className="text-2xl font-bold mb-6">📊 Répartition des Commandes par Statut</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={commandesParStatut}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {commandesParStatut.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {commandesParStatut.map((statut) => (
              <div key={statut.name} className="flex justify-between items-center border-2 border-gray-300 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: statut.color }}></div>
                  <span className="font-semibold">{statut.name}</span>
                </div>
                <span className="text-xl font-bold">{statut.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center border-4 border-black p-3 bg-black text-white">
              <span className="font-bold">TOTAL</span>
              <span className="text-xl font-bold">{commandes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 des plats */}
      <div className="border-4 border-black p-6 bg-white">
        <h3 className="text-2xl font-bold mb-6">🏆 Statistiques Détaillées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-lg mb-3">💰 CA par Statut</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-green-50 border-2 border-green-300">
                <span>Récupérées</span>
                <span className="font-bold">
                  {commandes.filter(c => c.statut === 'recuperee').reduce((s, c) => s + c.montant_total, 0).toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between p-2 bg-blue-50 border-2 border-blue-300">
                <span>En cours</span>
                <span className="font-bold">
                  {commandes.filter(c => ['en_attente', 'en_preparation', 'prete'].includes(c.statut)).reduce((s, c) => s + c.montant_total, 0).toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 border-2 border-red-300">
                <span>Annulées</span>
                <span className="font-bold">
                  {commandes.filter(c => c.statut === 'annulee').reduce((s, c) => s + c.montant_total, 0).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-3">📅 Période</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50 border-2 border-gray-300">
                <span>Aujourd'hui</span>
                <span className="font-bold">
                  {commandes.filter(c => {
                    const today = new Date().toISOString().split('T')[0];
                    return c.created_at.split('T')[0] === today && c.statut !== 'annulee';
                  }).reduce((s, c) => s + c.montant_total, 0).toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 border-2 border-gray-300">
                <span>Cette semaine</span>
                <span className="font-bold">
                  {commandes.filter(c => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(c.created_at) >= weekAgo && c.statut !== 'annulee';
                  }).reduce((s, c) => s + c.montant_total, 0).toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 border-2 border-gray-300">
                <span>Ce mois-ci</span>
                <span className="font-bold">
                  {commandes.filter(c => {
                    const date = new Date(c.created_at);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && 
                           date.getFullYear() === now.getFullYear() && 
                           c.statut !== 'annulee';
                  }).reduce((s, c) => s + c.montant_total, 0).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

