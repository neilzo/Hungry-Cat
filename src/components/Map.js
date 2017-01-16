import React, { Component } from 'react';

function isEmpty(object) {
    if (typeof object !== 'object') {
        throw new Error('That is not an object!');
    }
    // Good code is code that you can't read but just works
    // JK todo fix this unreadable mess
    return !(!!Object.keys(object).length);
}

const Featured = ({ rez }) => (
    <p>{rez.name}</p>
);

export default class Map extends Component {
    static propTypes = {
        position: React.PropTypes.shape({
            latitude: React.PropTypes.number,
            longitude: React.PropTypes.number,
        }),
    };

    static defaultProps = {
        position: {},
    };

    state = {
        featured: {},
        results: [],
    };

    map = null;
    service = null;
    markers = [];

    componentDidMount() {
        const { position: { lat, long } } = this.props;
        const latLng = {lat: lat, lng: long};
        this.map = new window.google.maps.Map(this.mapWrap, {
          center: latLng,
          zoom: 15
        });

        this.addMarker({lat: () => lat, lng: () => long});

        const request = {
            location: latLng,
            radius: '1000',
            types: ['restaurant', 'cafe', 'meal_takeaway'],
            openNow: true,
        };
        this.getNearbyPlaces(request);
    }

    getNearbyPlaces = (request) => {
        this.service = new window.google.maps.places.PlacesService(this.map);
        const results = this.service.nearbySearch(request, (results) => {
            this.setState({ results }, () => this.getRez());
        });
    };

    getRez = () => {
        const rez = this.state.results.shift();
        this.setState({featured: rez});
        this.addMarker(rez.geometry.location);
    };

    addMarker = (location) => {
        const latLng = {
            lat: location.lat(),
            lng: location.lng(),
        }
        const marker = new window.google.maps.Marker({
          position: latLng,
          map: this.map
        });
        this.markers.push(marker);
    };

    render() {
        const { results, featured } = this.state;
        return (
            <div style={{height: '100%', display: 'flex'}}>
                <div style={{flex: '1'}}>
                    <Featured rez={featured} />
                </div>
                <div className="map" ref={div => this.mapWrap = div} />
            </div>
        );
    }
}
