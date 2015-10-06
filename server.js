(function(){

  'use strict';
  var express = require('express');
  var reloader = require('connect-livereload');
  var app = express();
  var yelpSecrets = require('./secrets.js');

  var router = express.Router();

  router.get('/', function(req, res){
    res.json({ message: 'hooray this works'});
  });

  var yelp = require('yelp').createClient({
    consumer_key: yelpSecrets.consumer_key,
    consumer_secret: yelpSecrets.consumer_secret,
    token: yelpSecrets.token,
    token_secret: yelpSecrets.token_secret
  });

  // yelp.search({term: "food", location: "New York"}, function(error, data) {
  //   console.log(error);
  //   console.log(data);
  // });
  
  app.use('/api', router);
  app.use(reloader());
  app.use(express.static('./client'));

  app.listen(9000, function(){
    console.log('App Listening on localhost:9000');
  });

})();