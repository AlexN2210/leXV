# Le XV Food Truck

Site web pour le food truck Le XV.

## Déploiement sur Vercel

### Variables d'environnement requises

Ajoutez ces variables d'environnement dans votre dashboard Vercel :

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_supabase
```

### Configuration

Le projet est configuré pour Vercel avec :
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 18.x

### Commandes

```bash
# Installation des dépendances
npm install

# Développement local
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```
