import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',          // silently update SW when new version ships
      injectRegister: 'auto',
      workbox: {
        // ── Cache these on install ──
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // ── Runtime caching strategies ──
        runtimeCaching: [
          {
            // Google Fonts stylesheet
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts actual font files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // API — workers list (stale-while-revalidate: show cached instantly, refresh in bg)
            urlPattern: /\/api\/workers(\?.*)?$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-workers',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 6 }, // 6 hours
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // API — config/categories (cache for 24h)
            urlPattern: /\/api\/config.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-config',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Worker profile pages
            urlPattern: /\/api\/workers\/[a-z0-9]+$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-worker-profiles',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 2 }, // 2 hours
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Worker photos / uploaded images
            urlPattern: /\/uploads\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'worker-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // DiceBear avatars
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'avatars',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'কারিগরি — বাংলাদেশের #১ সার্ভিস প্ল্যাটফর্ম',
        short_name: 'কারিগরি',
        description: 'যাচাইকৃত প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার — সরাসরি যোগাযোগ',
        theme_color: '#006A4E',
        background_color: '#F8FAFC',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Chunk splitting — vendor libs in separate cache-busted chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide':       ['lucide-react'],
        },
      },
    },
  },
});
