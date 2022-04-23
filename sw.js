const cacheName = 'ordloh-1'

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll([
      '/',
      '/dayjs-utc-timezone-1.11.0.js',
      '/icon.png',
      '/index.css',
      '/index.js',
      '/manifest.json',
      '/progress.css',
      '/TitilliumWeb.woff2'
    ])),
  )
})

self.addEventListener('fetch', (e) => {
  console.log(e.request.url)
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})
