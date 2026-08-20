/**
 * Service worker básico: cachea el app shell (páginas y estáticos del
 * mismo origen) con estrategia stale-while-revalidate para que la PWA
 * abra rápido en 3G/con cortes de señal. No toca llamadas a la API
 * (otro origen) ni nada que no sea GET.
 */
const CACHE_NAME = 'directorio-solidario-shell-v1';
const APP_SHELL = ['/', '/manifest.json', '/favicon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // no interceptar la API

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });

      if (cached) {
        // Ya respondimos con la versión cacheada; actualiza en segundo
        // plano y descarta el error si no hay red (evita "unhandled
        // rejection", ya servimos algo válido).
        network.catch(() => {});
        return cached;
      }
      // Sin caché: la respuesta depende de la red, si falla debe
      // rechazar (nunca resolver a undefined, que rompe respondWith).
      return network;
    }),
  );
});
