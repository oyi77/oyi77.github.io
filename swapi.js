// Minimal Service Worker for EcmaOS
// This prevents the 404 error when EcmaOS tries to register a service worker

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Pass through all requests - no caching
    event.respondWith(fetch(event.request));
});
