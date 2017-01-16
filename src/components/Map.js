import React, { Component } from 'react'

const Row = ({ rez }) => (
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
        results: [],
    };

    map = null;
    service = null;

    componentDidMount() {
        const { position: { lat, long } } = this.props;
        const latLng = {lat: lat, lng: long};
        this.map = new window.google.maps.Map(this.mapWrap, {
          center: latLng,
          zoom: 15
        });
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
            this.setState({ results });
        });
    };

    render() {
        const { results } = this.state;
        return (
            <div style={{height: '100%', display: 'flex'}}>
                {!!results.length && <div style={{flex: '1'}}>
                    {results.map(rez => <Row rez={rez} />)}
                </div>}
                <div className="map" ref={div => this.mapWrap = div} />
            </div>
        );
    }
}
