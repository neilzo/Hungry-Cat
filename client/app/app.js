(function() {
  'use strict';
  var userLat;
  var userLon;
  var offset = 0; //grab more results from yelp, since they limit a response to 20 businesses
  var map;
  var businessMarkers = [];
  var infoWindow;
  var bizData;
  var bizLocation;

  /* APP INIT */
  window.initMap = function() {
    window.directionsService = new google.maps.DirectionsService;
    window.directionsDisplay = new google.maps.DirectionsRenderer; //cries, TODO: make this not on window

    var geoOptions = {
      timeout: 10 * 1000,
      maximumAge: 1000 * 60 * 30 //30 minutes before grabbing new location
    };

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7127, lng: -73.935242}, //center on NYC
      zoom: 15    
    });

    window.directionsDisplay.setMap(map);

    infoWindow = new google.maps.InfoWindow({ //eslint-disable-line
      content: 'DIS YOU'
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        var pos = {
          lat: userLon,
          lng: userLat
        };

        map.setCenter(pos);

        document.getElementById('feelinLucky').removeAttribute('disabled');
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }, geoOptions);
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  };

  /* === METHODS === */

  /* MAP METHODS */

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: {lat: userLat, lng: userLon},
      destination: {lat: bizLocation.lat, lng: bizLocation.lng},
      travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  function mapYoDigs(data) {
    var biz = {};
    var pos = {};

    pos.lat = data.location.coordinate.latitude;
    pos.lng = data.location.coordinate.longitude;
    
    biz.pos = pos;
    bizLocation = pos;
    biz.name = data.name;

    calculateAndDisplayRoute(window.directionsService, window.directionsDisplay);
  }

  /* FOOD DECIDER METHODS */

  //the kick off, calls ajax for local results, transitions between state 1 & 2
  function findFoodLucky() {
    var url;

    //just to be safe
    if (!userLat && !userLon) {
      alert('coordinates not ready. try again.');
      return;
    }

    url = '/api/lucky?lat=' + userLat + '&lon=' + userLon;

    //removeMarkers(); //remove existing markers
    document.getElementById('header').classList.add('fadeout');
    document.getElementById('main').classList.add('fadein');
    maiAJAXGet(url);
  }

  //this is becoming a beast, TODO: find a better way
  function formatResults(data) {
    var businessWrap,
      businessesReview,
      businessImage,
      businessName,
      businessLink,
      businessReviewCount,
      result = document.getElementById('results'),
      biz = selectBiz(data),
      businessTypes,
      businessCats = getBizCategories(biz),
      businessAddress,
      businessAddressString = getBizAddress(biz);

    businessWrap = document.createElement('div');
    businessWrap.setAttribute('class', 'food-card animate');

    businessImage = document.createElement('img');
    businessImage.setAttribute('class', 'main-img');
    businessImage.setAttribute('src', setYelpImg(biz.image_url, 'ls'));

    businessesReview = document.createElement('img');
    businessesReview.setAttribute('src', biz.rating_img_url);

    businessReviewCount = document.createElement('p');
    businessReviewCount.textContent = 'Review Count: ' + biz.review_count;
    
    businessName = document.createElement('p');
    businessName.setAttribute('class', 'business-name');
    businessName.textContent = biz.name;

    businessLink = document.createElement('a');
    businessLink.textContent = 'View on Yelp';
    businessLink.setAttribute('href', biz.url);
    businessLink.setAttribute('target', '_blank');

    businessTypes = document.createElement('p');
    businessTypes.textContent = 'Categories: ' + businessCats;

    businessAddress = document.createElement('p');
    businessAddress.textContent = 'Address: ' + businessAddressString;

    businessWrap.appendChild(businessImage);
    businessWrap.appendChild(businessName);
    businessWrap.appendChild(businessAddress);
    businessWrap.appendChild(businessTypes);
    businessWrap.appendChild(businessLink);
    businessWrap.appendChild(businessesReview);
    businessWrap.appendChild(businessReviewCount);

    result.innerHTML = ''; //clear result wrap
    result.appendChild(businessWrap); //append business
  }

  //if all results have been shown, query to find additional, else format prexisting data
  function reRoll(refresh) {
    removeMarkers(); //remove existing markers
    if (refresh === 'refresh') {
      offset += 20; //increase global offset to grab more results
      var url = '/api/lucky?lat=' + userLat + '&lon=' + userLon + '&offset=' + offset;

      maiAJAXGet(url);
    } else {
      formatResults(bizData);
    }
  }

  //grab a higher quality biz thumbnail
  //examples of type:
  //ms: 100 x 100
  //ls: 250 x 250
  //348s: 348 x 348
  //o: up to 1000 x 1000
  function setYelpImg(url, type) {
    var extension = type + '.jpg';
    var regex = /[^/]*$/;

    return url.replace(regex, extension);
  }

  //test if element has been shown to user
  function allShown(element) {
    return element.shown;
  }

  //selects a random business, from the given response data
  function selectBiz(data) {
    var random = Math.floor(Math.random() * data.businesses.length);
    var chosenOne;

    //if all shown, query for more, else try to find unshown in current data
    if (data.businesses[random].shown) {
      if (data.businesses.every(allShown)) {
        console.log('SHOWN ALL, REQUESTING MORE!');
        reRoll('refresh');
      } else {
        console.log('shown, trying again');
        return selectBiz(data); //OH BOY RECURSION
      }
    }

    chosenOne = data.businesses[random];
    mapYoDigs(chosenOne);
    chosenOne.shown = true; //is this the best way? no, but i'm gonna try it
    return chosenOne;
  }

  //returns a single business' categories and formats it
  function getBizCategories(biz) {
    var catString = '';
    
    for (var i = 0; i < biz.categories.length; i++) {
      if (biz.categories.length === 1 || i === biz.categories.length - 1) {
        catString += biz.categories[i][0];
      } else {
        catString += biz.categories[i][0] + ', ';
      }
    };

    return catString;
  }

  //returns a single business' address and formats it
  function getBizAddress(biz) {
    return biz.location.display_address[0] + ', ' + biz.location.display_address[2];
  }

  //Vanilla js ajax
  function maiAJAXGet(url) {    
    var request = new XMLHttpRequest();
    var data;

    console.log('AJAX REQUEST!');

    request.open('GET', url, true);
    document.getElementById('results').innerHTML = 'LOADING...';

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        data = JSON.parse(request.responseText);
        bizData = data; //store so we can flag which results were already seen, go back, etc.
        formatResults(bizData); 
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

  /* === END METHODS === */

  /* EVENT LISTENERS */
  document.getElementById('feelinLucky').addEventListener('click', findFoodLucky);
  document.getElementById('again').addEventListener('click', reRoll);

})();