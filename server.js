(function(){
  'use strict';
  var express = require('express');
  //var reloader = require('connect-livereload');
  var app = express();
  var config = require('./secrets');

  var router = express.Router();

  var yelp = require('yelp').createClient({
    consumer_key: config.yelp.consumer_key,
    consumer_secret: config.yelp.consumer_secret,
    token: config.yelp.token,
    token_secret: config.yelp.token_secret
  });

  router.use(function(req, res, next) {
    //console.log('happenings!');

    next();
  });

  router.route('/search').get(function(req, res){
    var term = req.query.term;
    var location = req.query.location;
    var offset = req.query.offset;

    //sucky
    if (offset) {
      yelp.search({term: term, location: location, category_filter: 'food', offset: offset}, function(error, data) {
        if (error) {
          res.send({
            message: 'There was an error searching Yelp.' + error
          });
        } else {
          res.send(data);
        }
      });
    } else {
      yelp.search({term: term, location: location, category_filter: 'food'}, function(error, data) { 
        if (error) {
          res.send({
            message: 'There was an error searching Yelp.' + error
          });
        } else {
          res.send(data);
        }
      });
    }
  });

  router.route('/lucky').get(function(req, res) {
    var ll = req.query.lat + ',' + req.query.lon;

    //sort: 1 sorts by distance    
    yelp.search({term: 'food', sort: 1, ll: ll}, function(error, data) {
      if (error) {
        res.send({
          message: 'There was an error searching Yelp.',
          error: error
        });
      } else {
        res.send(data);
      }
    });
  });
  
  app.use('/api', router);
  //app.use(reloader());
  app.use(express.static('./client'));

  app.listen(9000);

})();