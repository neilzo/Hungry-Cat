(function() {
    'use strict';
    const express = require('express');
    const app = express();
    const config = require('./secrets');
    const bodyParser = require('body-parser');
    const Yelp = require('yelp');
    const fakeData = require('./sample.json');

    const router = express.Router();

    app.use(bodyParser.json()); // for parsing application/json

    const yelp = new Yelp({consumer_key: config.yelp.consumer_key, consumer_secret: config.yelp.consumer_secret, token: config.yelp.token, token_secret: config.yelp.token_secret});

    router.use((req, res, next) => {
        console.log('happenings!');
        next();
    });

    router.route('/test').get((req, res, next) => {
        res.send({message: 'OK!'});
    });

    router.route('/food').post(function(req, res) {
        console.log(req.body);
        const ll = req.body.lat + ',' + req.body.long;
        // const offset = req.query.offset;
        const radius = 1609.34; //1 mile in meters

        //sort: 1 sorts by distance
        // yelp.search({term: 'food', sort: 1, ll: ll, radius: radius}).then((data) => {
        //     res.send(data);
        // }).catch((err) => {
        //     res.status(500).send(err);
        // });
        res.send(fakeData);
    });

    app.use('/api', router);
    app.use(express.static('./public'));

    app.listen(9000);
})();
