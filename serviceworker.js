// Base Service Worker

var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    '/core/templates/index.html',
    '/core/templates/offline.html/',
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
self.addEventListener("fetch", event => {
    // Solo cachear solicitudes con esquema http o https
    if (event.request.url.startsWith('http')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return caches.open(staticCacheName).then(cache => {
                        // Verificar que la respuesta sea válida antes de almacenarla en la caché
                        if (event.request.method === 'GET' && response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    });
                })
                .catch(() => {
                    // Si no hay conexión, devolver desde la caché
                    return caches.match(event.request)
                        .then(response => {
                            return response || caches.match('/offline/'); // Cambiar 'offline' por tu archivo adecuado
                        });
                })
        );
    }
});


// Manejar mensajes push
self.addEventListener('push', function(event) {
    let notificationData = {};
    
    if (event.data) {
        notificationData = event.data.json();
    }
    
    const title = notificationData.notification.title || 'Título predeterminado';
    const options = {
        body: notificationData.notification.body || 'Cuerpo de notificación predeterminado.',
        icon: notificationData.notification.icon || '/static/icono/image.png',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
