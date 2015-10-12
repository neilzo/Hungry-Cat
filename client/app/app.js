(function() {
  'use strict';
  var userLat;
  var userLon;
  var offset = 0; //grab more results from yelp, since they limit a response to 20 businesses
  var map;
  var businessMarkers = [];
  var infoWindow;
  var bizData;

  /* APP INIT */
  function initialize() {
    console.log('working!');
    getUserLocation();
  }
  
  /*
  window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7127, lng: -73.935242},
      zoom: 15
    });
    infoWindow = new google.maps.InfoWindow({ //eslint-disable-line
      content: 'DIS YOU'
    });

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var houseIcon = {
        url: '../public/house2.png',
        size: new google.maps.Size(25, 25),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 30)
      };

      var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
      };

      var marker = new google.maps.Marker({
        position: pos,
        icon: houseIcon,
        shape: shape,
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
  */

  function addMarkers(data) {
    for (var i = 0; i < data.length; i++) { //eslint-disable-line
      var marker = new google.maps.Marker({ //eslint-disable-line 
        position: data[i].pos,
        animation: google.maps.Animation.DROP
      });

      marker.info = new google.maps.InfoWindow({
        content: data[i].name
      });

      google.maps.event.addListener(marker, 'mouseover', function() {
        this.info.open(map, this);
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        this.info.close(map, marker);
      });

      businessMarkers.push(marker);
    }
    setMapOnAll(map);
  };

  function setMapOnAll(map) {
    for (var i = 0; i < businessMarkers.length; i++) {
      businessMarkers[i].setMap(map);
    }
  }

  function removeMarkers() {
    setMapOnAll(null);
    businessMarkers = [];
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

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

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

    console.log(biz);

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

  function reRoll() {
    var url;
    offset += 20; //increase global offset to grab more results
    
    //removeMarkers(); //remove existing markers

    //maiAJAXGet(url);

    formatResults(bizData);
  }

  function mapYoDigs(data) {
    var businessLocations = [];
    for (var i = 0; i < data.length; i++) { //eslint-disable-line
      var biz = {};
      var pos = {}; //eslint-disable-line

      pos.lat = data[i].location.coordinate.latitude;
      pos.lng = data[i].location.coordinate.longitude;
      
      biz.pos = pos;

      biz.name = data[i].name;

      businessLocations.push(biz);
    }
    addMarkers(businessLocations);
  }

  function setYelpImg(url, type) {
    var extension = type + '.jpg';
    var regex = /[^/]*$/;

    return url.replace(regex, extension);
  }

  function selectBiz(data) {
    var random = Math.floor(Math.random() * data.businesses.length);

    return data.businesses[random];
  }

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

  function getBizAddress(biz) {
    return biz.location.display_address[0] + ', ' + biz.location.display_address[2];
  }

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
        bizData = data;
        formatResults(data);
        //mapYoDigs(data.businesses);
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
  document.getElementById('again').addEventListener('click', reRoll);

  /* START THE DANG THING */
  initialize();
})();