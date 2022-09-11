let eastingInput = document.getElementsByName('easting')[0]
let northingInput = document.getElementsByName('northing')[0]
let latitudeInput = document.getElementsByName('latitude')[0]
let longitudeInput = document.getElementsByName('longitude')[0]

function onProjectedInput() {
  let [latitude, longitude] = computeLatLon(parseInt(eastingInput.value), parseInt(northingInput.value))
  latitudeInput.value = latitude
  longitudeInput.value = longitude
}

function onLatLonInput() {
  let [northing, easting] = computeRSO(parseInt(latitudeInput.value), parseInt(longitudeInput.value))
  eastingInput.value = easting
  northingInput.value = northing
}

eastingInput.addEventListener('input', onProjectedInput)
northingInput.addEventListener('input', onProjectedInput)

latitudeInput.addEventListener('input', onLatLonInput)
longitudeInput.addEventListener('input', onLatLonInput)
