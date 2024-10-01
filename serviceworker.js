// Base Service Worker implementation.  To use your own Service Worker, set the PWA_SERVICE_WORKER_PATH variable in settings.py

var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    '/core/templates/base.html',
    '/offline/',
    '/static/css/style.css',
    '/static/js/main.js',
    
    
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("django-pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
/*self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/offline/');
            })
    )
});*/

self.addEventListener("fetch", function(event) {
    // Filtra las solicitudes con esquemas no compatibles (como 'chrome-extension://')
    if (event.request.url.startsWith('chrome-extension://')) {
        return; // No hacer nada si la solicitud es de una extensión de Chrome
    }

    event.respondWith(
        fetch(event.request)
        .then(function(response) {
            return caches.open(staticCacheName)
            .then(function(cache) {
                // Asegúrate de que la respuesta sea válida antes de almacenarla
                if (event.request.method === 'GET' && response.status === 200) {
                    cache.put(event.request, response.clone());
                }
                return response;
            });
        })
        .catch(function() {
            // Si falla, intenta obtener la solicitud de la caché
            return caches.match(event.request)
            .then(function(response) {
                // Retorna el recurso en caché o un fallback si es necesario
                return response || new Response('No hay conexión y no se encuentra en caché');
            });
        })
    );
});
