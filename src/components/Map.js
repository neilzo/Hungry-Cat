import React, { Component } from 'react';

const Featured = ({ rez, details, rez: { opening_hours }, photos }) => {
    opening_hours = opening_hours || {};
    const imgs = photos.map((photo, i) => <img src={photo} alt="restaurant" key={i}/>);
    return (
        <div>
            <p>Name: {rez.name}</p>
            <p>Rating: {details.rating}</p>
            <p>Mo Money Mo Problems: {'$'.repeat(details.price_level)}</p>
            <p>{opening_hours.open_now ? 'Open Now' : null}</p>
            <p>Address: {rez.vicinity}</p>
            {imgs}
        </div>
    );
}

Featured.defaultProps = {
    opening_hours: {},
};

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
        photos: [],
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
        }, result => this.setState({details: result}, this.getRezPhoto(this.state.featured)));
    };

    getRezPhoto = (place) => {
        const photos = place.photos;
        if (!photos) {
          return;
        }

        this.setState((previousState) => {
            const clonedState = {...previousState};
            photos.forEach(() => {
                clonedState.photos.push(photos[0].getUrl({'maxWidth': 1024, 'maxHeight': 768}));
            });
            return clonedState;
        });
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
        const { featured, details, photos } = this.state;
        return (
            <div className="map-wrap">
                <div style={{flex: '1'}}>
                    <div style={{flex: '1'}}>
                        <Featured rez={featured} details={details} photos={photos} />
                    </div>
                    <div className="map" ref={div => this.mapWrap = div} />
                </div>
                <div style={{flex: '1'}}>
                    <button className="btn btn-action">Next</button>
                </div>
            </div>
        );
    }
}
