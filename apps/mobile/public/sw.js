/**
 * Service worker básico: cachea el app shell (páginas y estáticos del
 * mismo origen) con estrategia network-first — siempre intenta traer lo
 * último si hay conexión, y solo usa la copia guardada cuando falla la
 * red (sin señal/3G cortado). Con stale-while-revalidate (cache primero)
 * el navegador podía quedarse sirviendo una versión vieja del bundle
 * indefinidamente sin que el usuario lo note; con conexión, acá siempre
 * gana la red. No toca llamadas a la API (otro origen) ni nada que no
 * sea GET. Subir CACHE_NAME al cambiar de estrategia para forzar
 * limpieza del caché anterior.
 */
const CACHE_NAME = 'directorio-solidario-shell-v2';
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
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          throw new Error('offline y sin caché para esta ruta');
        }),
      ),
  );
});
