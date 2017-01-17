import React, { Component } from 'react';

const Featured = ({ rez, details }) => (
    <div>
        <p>Name: {rez.name}</p>
        <p>Rating: {details.rating}</p>
        <p>Mo Money Mo Problems: {'$'.repeat(details.price_level)}</p>
    </div>
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
        details: {},
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
        this.service.nearbySearch(request, (results) => {
            this.setState({ results }, () => this.getRez());
        });
    };

    getRez = () => {
        const rez = this.state.results.shift();
        this.setState({featured: rez}, () => this.getRezDetails());
        this.addMarker(rez.geometry.location);
    };

    getRezDetails = () => {
        this.service.getDetails({
            placeId: this.state.featured.place_id,
        }, result => this.setState({details: result}));
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
        const { featured, details } = this.state;
        return (
            <div style={{height: '100%', display: 'flex'}}>
                <div style={{flex: '1'}}>
                    <Featured rez={featured} details={details} />
                </div>
                <div className="map" ref={div => this.mapWrap = div} />
            </div>
        );
    }
}
