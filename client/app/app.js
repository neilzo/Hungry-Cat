(function() {
  'use strict';
  var userLat;
  var userLon;
  var offset = 0; //grab more results from yelp, since they limit a response to 20 businesses
  var isLucky = false;
  var businessLocations = [];

  /* APP INIT */
  function initialize() {
    console.log('working!');
    getUserLocation();
  }

  window.initMap = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7127, lng: -73.935242},
      zoom: 14
    });
    var infoWindow = new google.maps.InfoWindow({
      content: 'DIS YOU'
    });

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var marker = new google.maps.Marker({
        position: pos,
        animation: google.maps.Animation.DROP,
        map: map
      });

      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  };

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  /* METHODS */
  function getUserLocation() {
    var startPos;
    var geoOptions = {
      timeout: 10 * 1000,
      maximumAge: 1000 * 60 * 30 //30 minutes before grabbing new location
    };

    var geoSuccess = function(position) {
      startPos = position;
      userLat = startPos.coords.latitude;
      userLon = startPos.coords.longitude;

      //disable when ready
      document.getElementById('feelinLucky').removeAttribute('disabled');
    };

    var geoError = function(error) {
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
      if (!error.code === 2) {
        alert('Error getting yo location. Error code: ' + error.code);
      }
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function findFood(event) {
    var term = encodeURIComponent(document.getElementById('term').value);
    var location = encodeURIComponent(document.getElementById('location').value);
    var url;

    event.preventDefault();

    //initial validation
    if (!term || !location) {
      alert('Enter your requirements, fool!');
      return;
    }

    url = '/api/search?=' + term + '&location=' + location;

    maiAJAXGet(url);
    isLucky = false; //keep track of state, of sorts
  }

  function findFoodLucky() {
    //just to be safe
    var url;

    if (!userLat && !userLon) {
      alert('coordinates not ready. try again.');
      return;
    }

    url = '/api/lucky?lat=' + userLat + '&lon=' + userLon;

    maiAJAXGet(url);
    isLucky = true; //keep track of state, of sorts
  }

  function formatResults(data) {
    var businessWrap,
      businessesReview,
      businessImage,
      businessName,
      name,
      i;
    var results = document.getElementById('results');
    
    results.innerHTML = ''; //clear div for results
    for (i = 0; i < data.businesses.length; i++) {
      businessWrap = document.createElement('div');

      businessImage = document.createElement('img');
      businessImage.setAttribute('src', data.businesses[i].image_url);

      businessesReview = document.createElement('img');
      businessesReview.setAttribute('src', data.businesses[i].rating_img_url);
      
      businessName = document.createElement('p');
      name = document.createTextNode(data.businesses[i].name);
      businessName.appendChild(name);

      businessWrap.appendChild(businessImage);
      businessWrap.appendChild(businessesReview);
      businessWrap.appendChild(businessName);

      results.appendChild(businessWrap);
    }
    document.getElementById('more').classList.remove('hide');
  }

  function getMore() {
    var url;
    var term = encodeURIComponent(document.getElementById('term').value);
    var location = encodeURIComponent(document.getElementById('location').value);
    offset += 20; //increase global offset to grab more results
    
    document.getElementById('more').classList.add('hide');

    if (isLucky) {
      url = '/api/lucky?lat=' + userLat + '&lon=' + userLon + '&offset=' + offset;
    } else {
      url = '/api/search?=' + term + '&location=' + location + '&offset=' + offset;
    }

    maiAJAXGet(url);
  }

  function mapYoDigs(data) {
    var i;
    var pos = {};

    for (i = 0; i < data.length; i++) {
      pos.lat = data[i].coordinate.latitude;
      pos.lon = data[i].coordinate.longitude;

      businessLocations.push(pos);
    }
    console.log(businessLocations);
  }

  function maiAJAXGet(url) {    
    var request = new XMLHttpRequest();
    var data;
    request.open('GET', url, true);
    document.getElementById('results').innerHTML = 'LOADING...';

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        data = JSON.parse(request.responseText);
        formatResults(data);
        mapYoDigs(data.businesses.location);
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