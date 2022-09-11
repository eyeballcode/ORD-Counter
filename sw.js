const version = '12'
const cacheName = `ordloh-${version}`

function cacheFiles(files) {
  return caches.open(cacheName).then(cache => {
    console.log('Caching files')

    return cache.addAll(files).then(() => self.skipWaiting())
    .catch(err => {
      console.error(err)

      return ''
    })
  })
}

self.addEventListener('install', event => {
  const timeStamp = Date.now()

  caches.keys().then(function (cachesNames) {
    return Promise.all(cachesNames.map((storedCacheName) => {
      if (storedCacheName === cacheName || !storedCacheName.startsWith('ordloh')) return Promise.resolve()
      return caches.delete(storedCacheName).then(() => {
        console.log('Old cache ' + storedCacheName + ' deleted')
      })
    }))
  })

  event.waitUntil(
    cacheFiles([
      '/',
      '/leave.html',
      '/dayjs-utc-timezone-isoweek-1.11.3.js',
      '/bootstrap-4.6.1.min.css',
      '/icon.png',
      '/index.css',
      '/index.js',

      '/malayan-rso.html',
      '/malayan-rso.js',
      '/malayan-rso-converter.js',
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
  if (event.request.method !== 'GET') return

  event.request.credentials = 'same-origin'

  event.respondWith(
    caches.open(cacheName)
    .then(cache => cache.match(event.request, {ignoreSearch: true}))
    .then(response => {
      return response || fetch(event.request)
    })
  )
})
