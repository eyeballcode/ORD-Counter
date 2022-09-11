let eastingInput = document.getElementsByName('easting')[0]
let northingInput = document.getElementsByName('northing')[0]
let latitudeInput = document.getElementsByName('latitude')[0]
let longitudeInput = document.getElementsByName('longitude')[0]

let getLocBtn = document.getElementById('get-loc')
let mapImg = document.getElementById('map-img')

let projectionTimeout

function onProjectedInput() {
  let [latitude, longitude] = computeLatLon(parseInt(eastingInput.value) * 10, parseInt(northingInput.value) * 10)
  latitudeInput.value = latitude
  longitudeInput.value = longitude

  clearTimeout(projectionTimeout)
  projectionTimeout = setTimeout(() => {
    updateMap(latitude, longitude)
  }, 3000)
}

function onLatLonInput() {
  let [northing, easting] = computeRSO(parseFloat(latitudeInput.value), parseFloat(longitudeInput.value))
  eastingInput.value = easting / 10
  northingInput.value = northing / 10
}

function updateMap(latitude, longitude) {
  mapImg.src = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=16&ie=UTF8&iwloc=&output=embed`
}

eastingInput.addEventListener('input', onProjectedInput)
northingInput.addEventListener('input', onProjectedInput)

latitudeInput.addEventListener('input', onLatLonInput)
longitudeInput.addEventListener('input', onLatLonInput)

getLocBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(coords => {
    let { latitude, longitude } = coords.coords
    latitudeInput.value = latitude
    longitudeInput.value = longitude

    onLatLonInput()
    updateMap(latitude, longitude)
  })
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(registration => {
    console.log('Service Worker Registered')
  })

  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker Ready')
  })
}
