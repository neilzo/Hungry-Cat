(function(){
  'use strict';

  function initialize(){
    console.log('working!');
    getUserLocation();
    findFood();
  }

  function getUserLocation() {
    var startPos;

    var geoSuccess = function(position) {
        startPos = position;
        document.getElementById('startLat').innerHTML = startPos.coords.latitude;
        document.getElementById('startLon').innerHTML = startPos.coords.longitude;
    };

    var geoError = function(error) {
        alert('Error getting yo location. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
      };
    return navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }

  function findFood(userLat, userLon) {
    var request = new XMLHttpRequest();
    request.open('GET', '/api', true);

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

  initialize();

})();