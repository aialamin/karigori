/**
 * sw.js — Custom Workbox Service Worker (injectManifest mode)
 *
 * Differences from the old auto-generated SW:
 * - activate handler nukes ALL unknown/old runtime caches so existing
 *   Android installs stop hitting QuotaExceededError
 * - navigationPreload is NOT enabled (was causing "cancelled preloadResponse" warnings)
 * - Runtime cache limits are much smaller to stay under browser quota
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// ── 1. Precache static assets (list injected by VitePWA at build time) ──
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ── 2. Skip waiting — new SW takes over immediately on deploy ──
self.skipWaiting();

// ── 3. Activate: claim clients + nuke old/unknown runtime caches ──
const CURRENT_RUNTIME_CACHES = [
  'google-fonts-stylesheets',
  'google-fonts-webfonts',
  'api-config',
  'api-workers',
  'api-worker-profiles',
  'worker-images',
  'avatars',
  'api-stats',
];

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Claim all open tabs/windows immediately
      self.clients.claim(),
      // Delete any cache whose name is not in our current set
      // This clears the old bloated caches on existing Android installs
      caches.keys().then((names) =>
        Promise.all(
          names
            .filter(
              (name) =>
                !name.startsWith('workbox-precache') &&
                !CURRENT_RUNTIME_CACHES.includes(name)
            )
            .map((name) => {
              console.log('[SW] Deleting stale cache:', name);
              return caches.delete(name);
            })
        )
      ),
    ])
  );
});

// ── 4. Runtime caching rules ──

// Google Fonts stylesheets
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'google-fonts-stylesheets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);

// Google Fonts webfont files
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);

// Config API (rarely changes)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/config'),
  new StaleWhileRevalidate({
    cacheName: 'api-config',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  })
);

// Worker list (short TTL)
registerRoute(
  ({ url }) => /^\/api\/workers(\?.*)?$/.test(url.pathname + url.search),
  new StaleWhileRevalidate({
    cacheName: 'api-workers',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 30 }),
    ],
  })
);

// Individual worker profiles
registerRoute(
  ({ url }) => /^\/api\/workers\/[^/]+$/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: 'api-worker-profiles',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 }),
    ],
  })
);

// Uploaded worker photos — NetworkFirst so profile updates show immediately
registerRoute(
  ({ url }) => url.pathname.startsWith('/uploads/'),
  new NetworkFirst({
    cacheName: 'worker-images',
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 3 }),
    ],
  })
);

// DiceBear avatars (small SVGs, stable)
registerRoute(
  ({ url }) => url.origin === 'https://api.dicebear.com',
  new CacheFirst({
    cacheName: 'avatars',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  })
);

// Stats API (very short TTL)
registerRoute(
  ({ url }) => url.pathname === '/api/stats',
  new StaleWhileRevalidate({
    cacheName: 'api-stats',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 2, maxAgeSeconds: 60 * 5 }),
    ],
  })
);
