// Service Worker for SELCAL Emulator PWA

const CACHE_NAME = 'selcal-v1.0.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/cockpit.css',
    '/js/selcal.js',
    '/js/audio.js',
    '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => {
                console.error('[SW] Cache error:', error);
            })
    );

    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // Otherwise, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response since it can only be consumed once
                        const responseToCache = response.clone();

                        // Cache the fetched response for future use
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Fetch error:', error);
                        // Return a custom offline page or error
                        return new Response('Offline - No network connection', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background sync (optional, for future features)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    // Handle background sync tasks here
});

// Push notifications (optional, for future features)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    // Handle push notifications here
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URL') {
        // Cache a specific URL
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.add(event.data.url);
                })
        );
    }
});
