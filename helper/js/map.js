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

$("#show_map").on("change", function(event) {
  if (this.checked) {
    var defaultLatLng = new google.maps.LatLng(39.8177000, 46.7528000);  // Default to Stepanakert when no geolocation support
    if ( navigator.geolocation ) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
    function drawMap(latlng) {
        var myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });
    }
  }
});
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

function drawLineBetween2Points() {
  // to do
}

function getNearBusStop() {
  var wgs84Sphere = new ol.Sphere(6378137), // need to read about this
      i = 0,
      stopsCount,
      distance,
      min,
      nearBusStop,
      coordinatesOfStops = [[46.76401, 39.824321], [46.755401,39.817567]], //need to get data from json
      myCoordinates = [46.7528000, 39.8177000]; // need to get real coordinates
  stopsCount = coordinatesOfStops.length;
  min = wgs84Sphere.haversineDistance(myCoordinates, coordinatesOfStops[i]); // need to read about methods of getting distance bettween 2 points
  nearBusStop = coordinatesOfStops[i];
  for (i = 1; i < stopsCount; i++) {
    distance = wgs84Sphere.haversineDistance(myCoordinates, coordinatesOfStops[i]);
    if (distance < min) {
      min = distance;
      nearBusStop = coordinatesOfStops[i];
    }
  }
  return {
    coordinates: nearBusStop,
    minDistance: formatLength(min)
  };
}

function formatLength(minDistance) {
  var distance;
  if (minDistance > 100) {
    distance = (Math.round(minDistance / 1000 * 100) / 100) +
        ' ' + 'km';
  } else {
    distance = (Math.round(minDistance * 100) / 100) +
        ' ' + 'm';
  }
  return distance;
}*/