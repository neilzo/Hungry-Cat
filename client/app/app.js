(function(){
  'use strict';

  function initialize(){
    console.log('working!');
    getUserLocation();
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

  initialize();

})();