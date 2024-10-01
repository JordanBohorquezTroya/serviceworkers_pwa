

# Página Web Sencilla con Service Worker para Soporte Offline

## Descripción General

Esta es una página web básica construida con Django que incluye un Service Worker para habilitar capacidades offline. El Service Worker almacena en caché los archivos estáticos, proporcionando un mecanismo de respaldo en caso de que el usuario pierda la conexión, lo que garantiza una mejor experiencia de usuario.

## Funcionalidades

-   **Soporte Offline**: El Service Worker almacena en caché los archivos estáticos esenciales para que la aplicación pueda cargarse incluso sin conexión a internet.
-   **Gestión de Caché**: Las cachés antiguas se eliminan automáticamente cuando se activa una nueva versión del Service Worker.
-   **Optimización en las Peticiones**: El Service Worker intenta servir los archivos desde la caché, y si no están disponibles, los obtiene de la red.

## Implementación del Service Worker

El Service Worker se encuentra en `serviceworkersjs` y se encarga de almacenar en caché, limpiar cachés obsoletas y servir archivos offline.

### Cómo Funciona

1.  **Caché de Archivos Estáticos durante la Instalación**:  
    Cuando el Service Worker se instala, almacena en caché los archivos estáticos esenciales, como los archivos HTML, CSS y JavaScript.
    
    javascript
    
    Copiar código
    
    `var staticCacheName = "django-pwa-v" + new Date().getTime();
    var filesToCache = [
        '/core/templates/index.html',
        '/offline/',
        '/static/css/style.css',
        '/static/js/main.js',
    ];` 
    
2.  **Eliminación de Cachés Antiguas**:  
    Durante la activación, el Service Worker elimina las cachés de versiones anteriores para asegurarse de que la aplicación siempre use los archivos más recientes.
    
    javascript
    
    Copiar código
    
    `self.addEventListener('activate', event => {
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
    });` 
    
3.  **Servir Archivos desde la Caché**:  
    Cuando se realiza una solicitud, el Service Worker intenta obtener el recurso de la red. Si la red no está disponible, sirve la versión almacenada en caché, lo que permite que la aplicación funcione sin conexión.
    
    javascript
    
    Copiar código
    
    `self.addEventListener("fetch", function(event) {
        if (event.request.url.startsWith('chrome-extension://')) {
            return;
        }
    
        event.respondWith(
            fetch(event.request)
            .then(function(response) {
                return caches.open(staticCacheName)
                .then(function(cache) {
                    if (event.request.method === 'GET' && response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                });
            })
            .catch(function() {
                return caches.match(event.request)
                .then(function(response) {
                    return response || new Response('No hay conexión y no se encuentra en caché');
                });
            })
        );
    });` 
    
4.  **Página de Respaldo Offline**:  
    Si un usuario está offline y el recurso solicitado no está en caché, el Service Worker devolverá una respuesta de respaldo, como una página de "sin conexión".
