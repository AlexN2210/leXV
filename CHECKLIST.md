# ✅ Checklist de Configuration - Le XV Food Truck

## 🗄️ Base de Données Supabase

### Scripts SQL à exécuter (dans l'ordre) :

- [ ] **1. `00_complete_setup.sql`** - Création des tables principales
- [ ] **2. `02_create_horaires_table.sql`** - Table des horaires
- [ ] **3. `04_create_admins_table.sql`** - Table des admins
- [ ] **4. Créer un utilisateur admin** dans Supabase Auth (Email: admin@lexv.fr, Mot de passe: AdminLeXV2025!)

---

## 🌐 Déploiement Vercel

### Variables d'environnement à configurer :

- [ ] `VITE_SUPABASE_URL` = https://wbdxpoiisfgzszegbxns.supabase.co
- [ ] `VITE_SUPABASE_ANON_KEY` = (votre clé anon)

---

## ✅ Vérifications

### Pages Frontend :
- [x] **Accueil** - Photos locales affichées
- [x] **Localisation** - 2 emplacements avec GPS
- [x] **Menu** - Affichage dynamique depuis BDD
- [x] **Commander** - Formulaire avec validation + PDF
- [x] **Admin** - Interface complète avec 2 onglets

### Fonctionnalités :
- [x] Système de navigation (Header/Footer)
- [x] Admin déplacé dans le Footer
- [x] Numéro de téléphone : 06 85 84 30 20
- [x] Sélection lieu → jour → date → heure
- [x] Génération de PDF de commande
- [x] Interface admin temps réel
- [x] Gestion complète du menu
- [x] Gestion des horaires
- [x] Gestion des emplacements

### Build :
- [x] Build de production fonctionne (✓ testé)
- [x] Pas d'erreurs de linting
- [x] Configuration Vercel OK
- [x] Variables d'environnement configurées localement

---

## 📊 État Actuel

### ✅ Fonctionnel :
- Configuration Vite/React/TypeScript
- Toutes les pages créées
- Composants admin créés
- Scripts SQL prêts
- Build réussi
- Dépendances installées (jsPDF, EmailJS, Supabase, Lucide)

### ⚠️ À faire :
1. Exécuter les scripts SQL dans Supabase
2. Créer le compte admin dans Supabase Auth
3. Configurer les variables d'environnement sur Vercel
4. Déployer sur Vercel

---

## 🎯 Identifiants Admin par défaut

**Email :** admin@lexv.fr  
**Mot de passe :** AdminLeXV2025!

⚠️ Changez le mot de passe après la première connexion !

---

## 📞 Contact

**Téléphone :** 06 85 84 30 20  
**Email site :** contact@lexv.fr

---

## 🚀 Commandes de développement

```bash
# Développement local
cd project
yarn dev

# Build de production
yarn build

# Preview du build
yarn preview

# Vérification TypeScript
yarn typecheck
```

