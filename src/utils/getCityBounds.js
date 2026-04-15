export function getLatLngBounds(city) {
  return new window.google.maps.LatLngBounds(
    { lat: city.bounds.south, lng: city.bounds.west },
    { lat: city.bounds.north, lng: city.bounds.east }
  );
}
