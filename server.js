(function() {
    'use strict';
    var express = require('express');
    var app = express();
    var config = require('./secrets');
    var bodyParser = require('body-parser');
    var Yelp = require('yelp');

    var router = express.Router();

    app.use(bodyParser.json()); // for parsing application/json

    var yelp = new Yelp({consumer_key: config.yelp.consumer_key, consumer_secret: config.yelp.consumer_secret, token: config.yelp.token, token_secret: config.yelp.token_secret});

    router.use(function(req, res, next) {
        console.log('happenings!');
        next();
    });

    router.route('/test').get(function(req, res, next) {
        res.send({message: 'OK!'});
    });

    router.route('/search').get(function(req, res) {
        var term = req.query.term;
        var ll = req.query.lat + ',' + req.query.lon;

        yelp.search({
            term: term,
            ll: ll,
            limit: 1
        }, function(error, data) {
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

    router.route('/food').post(function(req, res) {
        console.log(req.body);
        var ll = req.body.lat + ',' + req.body.long;
        // var offset = req.query.offset;
        var radius = 1609.34; //1 mile in meters

        //sort: 1 sorts by distance
        yelp.search({term: 'food', sort: 1, ll: ll, radius: radius}).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.use('/api', router);
    app.use(express.static('./public'));

    app.listen(9000);
})();
