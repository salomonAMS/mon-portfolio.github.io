// Service Worker pour Portfolio - Cache optimisé
// Version 1.4 - Correction des ressources manquantes

const CACHE_NAME = 'portfolio-v1.4';
const URLS_TO_CACHE = [
    './',
    './index.html',
    './offline.html',
    './CV-Salomon-AMOUSSOU-KPAKPA.pdf',
    './assets/css/meyawo.css',
    './assets/js/meyawo.js',
    './assets/js/typewriter.js',
    './assets/js/navbar-scroll.js',
    './assets/vendors/themify-icons/css/themify-icons.css',
    './assets/vendors/themify-icons/fonts/themify.woff2',
    './assets/vendors/themify-icons/fonts/themify.woff',
    './assets/vendors/themify-icons/fonts/themify.ttf',
    './assets/vendors/themify-icons/fonts/themify.eot',
    './assets/vendors/themify-icons/fonts/themify.svg',
    './assets/imgs/mon logo.png',
    './assets/imgs/télécharger (3).jpeg',
    './assets/imgs/man.png',
    './assets/imgs/analytics.svg',
    './assets/imgs/toolbox.svg',
    './assets/imgs/responsive.svg',
    './assets/imgs/pencil-case.svg',
    './assets/imgs/todolist.shot.png',
    './assets/imgs/auth.shot.png',
    './assets/imgs/Bot.shot.png',
    './assets/imgs/favicon-96x96.png',
    './assets/imgs/favicon.svg',
    './assets/imgs/favicon.ico',
    './assets/imgs/apple-touch-icon.png',
    './assets/imgs/site.webmanifest',
    './assets/imgs/web-app-manifest-192x192.png',
    './assets/imgs/web-app-manifest-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installation en cours...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache ouvert');
                return cache.addAll(URLS_TO_CACHE);
            })
            .then(() => {
                console.log('Service Worker: Toutes les ressources ont été mises en cache');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Erreur lors de la mise en cache:', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activation en cours...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Suppression du cache obsolète:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation terminée');
            return self.clients.claim();
        })
    );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non-GET et les requêtes vers d'autres domaines
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourner la ressource du cache si elle existe
                if (response) {
                    console.log('Service Worker: Ressource servie depuis le cache:', event.request.url);
                    return response;
                }
                
                // Sinon, récupérer la ressource du réseau
                console.log('Service Worker: Récupération depuis le réseau:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // Vérifier si la réponse est valide
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Cloner la réponse car elle ne peut être utilisée qu'une fois
                        const responseToCache = response.clone();
                        
                        // Ajouter la nouvelle ressource au cache
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('Service Worker: Erreur réseau:', error);
                        
                        // Retourner une page d'erreur générique si disponible
                        if (event.request.destination === 'document') {
                            return caches.match('/offline.html');
                        }
                        
                        // Pour les autres ressources, on peut retourner une ressource par défaut
                        return new Response('Ressource indisponible', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Écouter les messages du client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        caches.open(CACHE_NAME).then(cache => {
            cache.keys().then(keys => {
                event.ports[0].postMessage({
                    type: 'CACHE_SIZE',
                    size: keys.length
                });
            });
        });
    }
});

// Gestion des erreurs globales
self.addEventListener('error', event => {
    console.error('Service Worker: Erreur globale:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker: Promise rejetée:', event.reason);
    event.preventDefault();
});
