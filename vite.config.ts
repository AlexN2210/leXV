import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['*.jpg', '*.png', '*.svg'],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Le XV - Backoffice Admin',
        short_name: 'XV Admin',
        description: 'Interface d\'administration Le XV Food Truck',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/#admin',
        id: '/admin',
        categories: ['food', 'restaurants', 'business'],
        prefer_related_applications: false,
        display_override: ['standalone', 'fullscreen'],
        icons: [
          {
            src: '/logoxv.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logoxv.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/logoxv.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Commandes',
            short_name: 'Commandes',
            description: 'Gérer les commandes',
            url: '/?admin=true&tab=commandes',
            icons: [{ src: '/logoxv.png', sizes: '192x192' }]
          },
          {
            name: 'Financier',
            short_name: 'Financier',
            description: 'Statistiques',
            url: '/?admin=true&tab=financier',
            icons: [{ src: '/logoxv.png', sizes: '192x192' }]
          },
          {
            name: 'Paramètres',
            short_name: 'Paramètres',
            description: 'Configuration',
            url: '/?admin=true&tab=parametres',
            icons: [{ src: '/logoxv.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/wbdxpoiisfgzszegbxns\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
  base: './',
});
