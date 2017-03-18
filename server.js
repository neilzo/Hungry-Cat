(function() {
    'use strict';
    require('isomorphic-fetch');
    const express = require('express');
    const app = express();
    const config = require('./secrets');
    const bodyParser = require('body-parser');
    const Yelp = require('yelp');
    const fakeData = require('./sample.json');

    const router = express.Router();

    app.use(bodyParser.json()); // for parsing application/json

    const foursquare = {
        client_id: config.foursquare.client_id,
        client_secret: config.foursquare.client_secret,
    };

    router.use((req, res, next) => {
        console.log('happenings!');
        next();
    });

    router.route('/test').get((req, res, next) => {
        res.send({message: 'OK!'});
    });

    router.route('/fq').post((req, res) => {
        const url = `https://api.foursquare.com/v2/venues/search?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}`;
        const ll = `${req.body.lat},${req.body.long}`;
        const query = req.body.query;

        fetch(`${url}&ll=${ll}&query=${query}&v=20161231`)
            .then((response) => response.json())
            .then(json => res.send(json))
            .catch(error => res.send(error));
    });

    app.use('/api', router);
    // app.use(express.static('./public'));

    app.listen(9000);
})();
