const version = '4a'
const cacheName = `ordloh-${version}`

function cacheFiles(files) {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(files).then(() => self.skipWaiting())
    .catch(e => {
      console.error(e)
      return ''
    })
  })
}

self.addEventListener('install', e => {
  const timeStamp = Date.now()

  caches.keys().then(function (cachesNames) {
    return Promise.all(cachesNames.map((storedCacheName) => {
      if (storedCacheName === cacheName || !storedCacheName.startsWith('ordloh')) return Promise.resolve()
      return caches.delete(storedCacheName).then(() => {
        console.log('Old cache ' + storedCacheName + ' deleted')
      })
    }))
  })

  e.waitUntil(
    cacheFiles([
      '/',
      '/leave.html',
      '/dayjs-utc-timezone-1.11.0.js',
      '/icon.png',
      '/index.css',
      '/index.js',
      '/manifest.json',
      '/progress.css',
      '/TitilliumWeb.woff2'
    ])
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  if (event.request.method != 'GET') return

  event.respondWith(
    caches.open(cacheName)
    .then(cache => cache.match(event.request, {ignoreSearch: true}))
    .then(response => {
      return response || fetch(event.request)
    })
  )
})
