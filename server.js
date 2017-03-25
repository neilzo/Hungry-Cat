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

    const fetchVenueDetails = (id) => {
        const url = `https://api.foursquare.com/v2/venues/${id}?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}&v=20161231`;
        return fetch(url);
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
            .then(json => {
                const response = json.response;
                // Implement a fuzzy search here
                // because `intent=match` is too damn strict ;_;
                const match = response.venues[0];
                if (match) {
                    // fetch the venue details
                    fetchVenueDetails(match.id)
                        .then(response => response.json())
                        .then(json => {
                            // TODO don't send the whole response
                            res.send(json);
                        })
                        .catch(e => res.send(e));
                } else {
                    res.send({ message: 'No results found :('});
                }
            })
            .catch(error => res.send(error));
    });

    router.route('/findFood').post((req, res) => {
        const url = `https://api.foursquare.com/v2/venues/explore?client_id=${foursquare.client_id}&client_secret=${foursquare.client_secret}`;
        const data = req.body;
        const ll = `${data.lat},${data.long}`;
        const section = data.section || 'food';
        const radius = data.radius || '1000';
        const offset = data.offset || '10';
        const venuePhotos = data.venuePhotos || '1';

        fetch(`${url}&ll=${ll}&section=${section}&radius=${radius}&offset=${offset}&venuePhotos=${venuePhotos}&v=20161231`)
            .then(response => response.json())
            .then((json) => res.send(json))
            .catch(e => res.send(e));
    });

    app.use('/api', router);
    // app.use(express.static('./public'));

    app.listen(9000);
})();
