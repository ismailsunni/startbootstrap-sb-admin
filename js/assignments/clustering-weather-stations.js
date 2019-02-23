var OpenWeatherKey = "b975cc9f4ba510724c9bdb7d7f317657";
var OpenWeatherURL = "http://api.openweathermap.org/data/2.5/find?";
var stations = [];

// Get the data
function getWeatherStations(lat, lon) {
  stations = [];
  var url =
    OpenWeatherURL +
    "lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    OpenWeatherKey +
    "&cnt=30&units=metric";
  // Add more station to the list
  $.getJSON(url, function(data) {
    var stationList = data["list"];
    $.each(stationList, function(index, station) {
      var name = station["name"];
      var longitude = station["coord"]["lon"];
      var latitude = station["coord"]["lat"];
      var temperature = station["main"]["temp"];
      stations.push({
        name: name,
        longitude: longitude,
        latitude: latitude,
        temperature: temperature
      });
    });
    stationMarkers = new L.markerClusterGroup();
    $.each(stations, function(stationId, station) {
      var popUpMessage = "<p>Station name: <b>" + station["name"] + '</b>';
      popUpMessage += "<br>Temperature: <b>" + station["temperature"] + "</b></p>";
      var marker = new L.marker([
        station["latitude"],
        station["longitude"]
      ]).bindPopup(popUpMessage);
      stationMarkers.addLayer(marker);
    });
    stationMarkers.addTo(map);
    map.fitBounds(stationMarkers.getBounds());
  });
}

var map = L.map("map").fitWorld();

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox.streets"
  }
).addTo(map);

function onLocationFound(e) {
  getWeatherStations(e.latlng.lat, e.latlng.lng);
}

function onLocationError(e) {
  alert(e.message);
}

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

map.locate({ setView: true, maxZoom: 16});