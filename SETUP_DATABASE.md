# Configuration de la Base de Données Supabase

## 📋 Scripts SQL à exécuter dans l'ordre

Allez sur votre dashboard Supabase : https://supabase.com/dashboard/project/wbdxpoiisfgzszegbxns/sql

### 1️⃣ Création des tables principales
**Fichier : `00_complete_setup.sql`**

Ce script crée toutes les tables nécessaires :
- `menu_categories` - Catégories du menu
- `menu_items` - Plats du menu
- `arrets` - Emplacements du food truck
- `commandes` - Commandes clients
- `commande_items` - Détails des commandes

✅ Exécutez ce script en premier

---

### 2️⃣ Création de la table horaires
**Fichier : `02_create_horaires_table.sql`**

Ce script crée la table des horaires d'ouverture pour chaque jour de la semaine.

✅ Exécutez ce script en deuxième

---

### 3️⃣ Création de la table admins
**Fichier : `04_create_admins_table.sql`**

Ce script crée la table pour gérer les administrateurs et crée l'admin principal :
- Email: `admin@lexv.fr`
- Mot de passe: `AdminLeXV2025!`

✅ Exécutez ce script en troisième

---

## 🔐 Création du compte admin dans Supabase Auth

**Important :** Pour vous connecter à l'espace admin, créez aussi un utilisateur dans Supabase Auth :

1. Allez sur : https://supabase.com/dashboard/project/wbdxpoiisfgzszegbxns/auth/users
2. Cliquez sur **"Add User"**
3. Remplissez :
   - Email: `admin@lexv.fr`
   - Password: `AdminLeXV2025!`
   - ✅ Cochez **"Auto Confirm User"**
4. Cliquez sur **"Create User"**

---

## ✅ Variables d'environnement Vercel

Dans votre dashboard Vercel, ajoutez ces variables :

```
VITE_SUPABASE_URL=https://wbdxpoiisfgzszegbxns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZHhwb2lpc2ZnenN6ZWdieG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDIxMzQsImV4cCI6MjA3NTQ3ODEzNH0.aKC7xN0NBfpnvgL6P6LY2p_LbEJ_OkEBAj1MqwAoF3U
```

---

## 📝 Résumé des données insérées

Après l'exécution des scripts, votre BDD contiendra :

**Catégories du menu :**
- Snacks
- Formules
- Menu Kids
- Dessert
- Boissons

**Plats du menu :** 13 plats au total

**Emplacements :**
- Place du marché aux raisins, Villeveynac (Mardi et Jeudi)
- Complexe sportif des Baux, Poussan (Mercredi et Vendredi)

**Horaires :**
- Mardi, Mercredi, Jeudi, Vendredi : 18:00 - 22:00 (actifs)
- Lundi, Samedi, Dimanche : désactivés

---

## 🚀 Une fois tout configuré

Votre site sera entièrement fonctionnel avec :
- ✅ Menu dynamique
- ✅ Système de commande
- ✅ Génération de PDF
- ✅ Interface admin complète
- ✅ Mise à jour en temps réel

