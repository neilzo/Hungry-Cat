(function(){
  'use strict';
  var userLat;
  var userLon;

  function initialize(){
    console.log('working!');
    getUserLocation();
  }

  function getUserLocation() {
    var startPos;
    var geoOptions = {
      timeout: 10 * 1000,
      maximumAge: 1000 * 60 * 10 //5 minutes before grabbing new location
    };

    var geoSuccess = function(position) {
        startPos = position;
        userLat = startPos.coords.latitude;
        userLon = startPos.coords.longitude;
    };

    var geoError = function(error) {
        alert('Error getting yo location. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
    };

    return navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function findFood() {
    if (!userLat && !userLon) {
      alert('coordinates not ready');
    }
    var url = '/api/search?lat=' + userLat + '&lon=' + userLon;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        console.log(data);
      } else {
        // We reached our target server, but it returned an error
        alert(request.responseText);
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      alert('Error sending your request');
    };

    request.send();
  }

  document.getElementById('search').addEventListener('click', findFood);

  initialize();

})();