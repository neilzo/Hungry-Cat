(function(){

  'use strict';
  var express = require('express');
  var reloader = require('connect-livereload');
  var app = express();
  var yelp = require('./secrets.js');

  app.use(reloader());
  app.use(express.static('./client'));

  app.listen(9000, function(){
    console.log('App Listening on localhost:9000');
  });

})();