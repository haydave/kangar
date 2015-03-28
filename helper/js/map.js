/*
 * Google Maps documentation: http://code.google.com/apis/maps/documentation/javascript/basics.html
 * Geolocation documentation: http://dev.w3.org/geo/api/spec-source.html
 */
/*
GMaps.geolocate({
  success: function(position) {
    map.setCenter(position.coords.latitude, position.coords.longitude);
  },
  error: function(error) {
    alert('Geolocation failed: '+error.message);
  },
  not_supported: function() {
    alert("Your browser does not support geolocation");
  },
  always: function() {
    alert("Done!");
  }
});
*/


/*var busStopMarker = new ol.Overlay({
  element: document.getElementById('busStopMarker'),
  stopEvent: false
});

var nearBusStopBtn = document.getElementById('nearBusStop');
nearBusStopBtn.addEventListener('click', function() {
  var projectedPosition,
    nearStop = getNearBusStop();
    console.log(nearStop);
  projectedPosition = ol.proj.transform(nearStop.coordinates, 'EPSG:4326','EPSG:3857');
  busStopMarker.set('position', projectedPosition);
  busStopMarker.set('positioning', 'center-center');
  map.addOverlay(busStopMarker);
  var element = document.getElementsByClassName("distance");
  element[0].innerHTML = nearStop.minDistance;
}, false);


}
*/