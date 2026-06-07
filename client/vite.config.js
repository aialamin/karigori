import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { compression } from 'vite-plugin-compression2';

export default defineConfig(({ mode }) => ({
  // Drop console.* and debugger in production builds only
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },

  plugins: [
    react({
      // Babel fast-refresh only in dev; no overhead in prod
      babel: { plugins: [] },
    }),

    // ── Brotli + Gzip pre-compressed assets ──
    // Nginx/Caddy/Vercel will serve .br / .gz automatically
    compression({ algorithm: 'brotliCompress', exclude: [/\.(png|jpg|webp|ico|woff2)$/] }),
    compression({ algorithm: 'gzip',           exclude: [/\.(png|jpg|webp|ico|woff2)$/] }),

    VitePWA({
      // injectManifest lets us use a custom sw.js with a full activate handler
      // that deletes old bloated caches on existing Android installs
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'site.webmanifest',
      injectManifest: {
        // Only precache small essential assets — skip JS chunks (they blow quota)
        globPatterns: ['**/*.{css,html,ico,png,webmanifest}'],
        // Never precache anything > 1 MB
        maximumFileSizeToCacheInBytes: 1 * 1024 * 1024,
      },
      manifest: {
        // ── Identity ──
        id: '/',
        name: 'কারিগরি — বাংলাদেশের #১ সার্ভিস প্ল্যাটফর্ম',
        short_name: 'কারিগরি',
        description: 'যাচাইকৃত প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার ও আরও পেশাদার — সরাসরি যোগাযোগ, কোনো কমিশন নেই।',
        lang: 'bn',
        dir: 'ltr',

        // ── Display ──
        display: 'standalone',
        // Preferred display order (browsers pick first supported)
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'portrait-primary',

        // ── URLs ──
        scope: '/',
        start_url: '/?utm_source=pwa',

        // ── Colors (match for solid splash screen on Android) ──
        theme_color: '#006A4E',
        background_color: '#006A4E',

        // ── Store metadata ──
        categories: ['business', 'utilities', 'productivity'],
        prefer_related_applications: false,

        // ── 2025: focus existing window when tapping the home-screen icon ──
        launch_handler: { client_mode: ['navigate-existing', 'auto'] },

        // ── 2025: Android opens karigori.org links inside the PWA, not the browser ──
        handle_links: 'preferred',

        // ── Icons ──
        // 96×96 → Android notification badges & smaller surfaces
        // 192 any + 512 any + 512 maskable → adaptive launcher & splash screen
        icons: [
          { src: '/icon-96.png',           sizes: '96x96',   type: 'image/png', purpose: 'any' },
          { src: '/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],

        // ── App shortcuts (long-press icon on Android home screen) ──
        shortcuts: [
          {
            name: 'প্লাম্বার খুঁজুন',
            short_name: 'প্লাম্বার',
            description: 'কাছের যাচাইকৃত প্লাম্বার খুঁজুন',
            url: '/browse/plumber?utm_source=pwa_shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'ইলেক্ট্রিশিয়ান খুঁজুন',
            short_name: 'ইলেক্ট্রিশিয়ান',
            description: 'কাছের যাচাইকৃত ইলেক্ট্রিশিয়ান খুঁজুন',
            url: '/browse/electrician?utm_source=pwa_shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'এসি মেকানিক খুঁজুন',
            short_name: 'এসি মেকানিক',
            description: 'AC সার্ভিস ও মেরামত',
            url: '/browse/ac_repair?utm_source=pwa_shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'কারিগর হিসেবে নিবন্ধন',
            short_name: 'নিবন্ধন করুন',
            description: 'আপনার সার্ভিস লিস্ট করুন',
            url: '/register?utm_source=pwa_shortcut',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
        ],

        // ── Screenshots — triggers richer "Add to Home Screen" dialog on Android Chrome ──
        screenshots: [
          {
            src: '/screenshot-mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'কারিগরি — কারিগর খুঁজুন',
          },
          {
            src: '/screenshot-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'কারিগরি ডেস্কটপ ভিউ',
          },
        ],
      },
    }),
  ],

  server: {
    port: 3000,
    proxy: {
      '/api':     { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },

  build: {
    // Modern targets — smaller output, no legacy polyfills
    target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
    // Don't report compressed sizes (faster build output)
    reportCompressedSize: false,
    // Raise chunk warning threshold — we split manually below
    chunkSizeWarningLimit: 600,
    cssMinify: true,
    minify: 'esbuild', // esbuild is 20-40x faster than terser with near-identical output

    rollupOptions: {
      output: {
        // Fine-grained manual chunks — each loads/caches independently
        manualChunks(id) {
          // React core — tiny, changes rarely → long cache
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'react-core';
          }
          // Router — changes rarely
          if (id.includes('node_modules/react-router')) return 'react-router';
          // Helmet (SEO) — changes rarely
          if (id.includes('node_modules/react-helmet-async')) return 'helmet';
          // Lucide icons — large but stable
          if (id.includes('node_modules/lucide-react')) return 'lucide';
          // xlsx — only used in admin, lazy-load separately
          if (id.includes('node_modules/xlsx')) return 'xlsx';
          // Workbox (SW) — already in its own chunk by PWA plugin
        },
        // Deterministic file names for long-term caching
        entryFileNames:  'assets/[name]-[hash].js',
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      },
    },
  },
}));
