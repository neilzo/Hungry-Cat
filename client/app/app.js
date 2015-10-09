(function(){
  'use strict';
  var userLat;
  var userLon;
  var offset = 0; //grab more results from yelp, since they limit a response to 20 businesses

  /* APP INIT */
  function initialize(){
    console.log('working!');
    getUserLocation();
  }

  /* METHODS */
  function getUserLocation() {
    var startPos;
    var geoOptions = {
      timeout: 10 * 1000,
      maximumAge: 1000 * 60 * 10 //10 minutes before grabbing new location
    };

    var geoSuccess = function(position) {
        startPos = position;
        userLat = startPos.coords.latitude;
        userLon = startPos.coords.longitude;

        //disable when ready
        document.getElementById('feelinLucky').removeAttribute('disabled');
    };

    var geoError = function(error) {
        alert('Error getting yo location. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function findFood(event) {
    event.preventDefault();

    var term = encodeURIComponent(document.getElementById('term').value);
    var location = encodeURIComponent(document.getElementById('location').value);

    //initial validation
    if (!term || !location) {
      alert('Enter your requirements, fool!');
      return;
    }

    var url = '/api/search?=' + term + '&location=' + location;

    maiAJAXGet(url);
  }

  function findFoodLucky() {
    //just to be safe
    if (!userLat && !userLon) {
      alert('coordinates not ready. try again.');
      return;
    }
    var url = '/api/lucky?lat=' + userLat + '&lon=' + userLon;

    maiAJAXGet(url);
  }

  function formatResults(data) {
    console.log(data.businesses);
    var results = document.getElementById('results');
    
    results.innerHTML = ''; //clear div for results
    for (var i = 0; i < data.businesses.length; i++) {
      var businessWrap = document.createElement('div');

      var businessImage = document.createElement('img');
      businessImage.setAttribute('src', data.businesses[i].image_url);

      var businessesReview = document.createElement('img');
      businessesReview.setAttribute('src', data.businesses[i].rating_img_url);
      
      var businessName = document.createElement('p');
      var name = document.createTextNode(data.businesses[i].name);
      businessName.appendChild(name);

      businessWrap.appendChild(businessImage);
      businessWrap.appendChild(businessesReview);
      businessWrap.appendChild(businessName);

      results.appendChild(businessWrap);
    }
    document.getElementById('more').classList.remove('hide');
  }

  function getMore() {
    offset += 20;
    console.log(offset);
    var url = '/api/lucky?lat=' + userLat + '&lon=' + userLon + '&offset=' + offset;

    maiAJAXGet(url);
  }

  function maiAJAXGet(url) {    
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    document.getElementById('results').innerHTML = 'LOADING...';

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        formatResults(data);
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

  /* EVENT LISTENERS */
  document.getElementById('feelinLucky').addEventListener('click', findFoodLucky);
  document.getElementById('search').addEventListener('submit', findFood);
  document.getElementById('more').addEventListener('click', getMore);

  /* START THE DANG THING */
  initialize();
})();