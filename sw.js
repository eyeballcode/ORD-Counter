self.addEventListener('install', event => {})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})
