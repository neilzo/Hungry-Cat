(function(){
  'use strict';
  var express = require('express');
  var https = require('https');
  var app = express();
  var oAuth = require('oauth');
  var config = require('./secrets');

  var router = express.Router();

  var deliveryId = config.delivery.client_id;
  var deliverySecret = config.delivery.secret;

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

  router.route('/test').get(function(req, res, next) {
    res.send({message: 'OK!'});      
  });

  router.route('/search').get(function(req, res) {
    var term = req.query.term;
    var ll = req.query.lat + ',' + req.query.lon;

    yelp.search({term: term, ll: ll, limit: 1}, function(error, data) {
      if (error) {
        res.status(400);
        res.send({
          message: 'There was an error searching Yelp.' + error
        });
      } else {
        res.send(data);
      }
    });
  });

  router.route('/lucky').post(function(req, res) {
    var ll = req.query.lat + ',' + req.query.lon;
    var offset = req.query.offset;
    var radius = 1609.34; //1 mile in meters

    if (offset) {
      //sort: 1 sorts by distance
      yelp.search({term: 'food', sort: 1, ll: ll, radius: radius, offset: offset}, function(error, data) {
        if (error) {
          res.status(400);
          res.send({
            message: 'There was an error searching Yelp.',
            error: error
          });
        } else {
          res.send(data);
        }
      });
    } else {
      //sort: 1 sorts by distance
      yelp.search({term: 'food', sort: 1, ll: ll, radius: radius}, function(error, data) {
        if (error) {
          res.status(400);
          res.send({
            message: 'There was an error searching Yelp.',
            error: error
          });
        } else {
          res.send(data);
        }
      });
    }
  });

  app.use('/api', router);
  app.use(express.static('./public'));

  app.listen(9000);
})();
