(function(){

  'use strict';
  var express = require('express');
  var reloader = require('connect-livereload');
  var app = express();
  var config = require('./secrets');

  var router = express.Router();

  var yelp = require('yelp').createClient({
    consumer_key: config.yelp.consumer_key,
    consumer_secret: config.yelp.consumer_secret,
    token: config.yelp.token,
    token_secret: config.yelp.token_secret
  });

  router.use(function(req, res, next){
    //console.log('happenings!');

    next();
  });

  router.route('/search').get(function(req, res){
    var ll = req.query.lat + ',' + req.query.lon;

    yelp.search({term: 'food', ll: ll}, function(error, data) {
      if (error) {
        res.send({
          message: 'There was an error searching Yelp.'
        });
      } else {
        res.send(data);
      }
    });

  });
  
  app.use('/api', router);
  app.use(reloader());
  app.use(express.static('./client'));

  app.listen(9000, function(){
    console.log('App Listening on localhost:9000');
  });

})();