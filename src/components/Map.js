import React, { Component } from 'react'

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

    map = null;

    componentDidMount() {
        const { position: { lat, long } } = this.props;
        this.map = new window.google.maps.Map(this.mapWrap, {
          center: {lat: lat, lng: long},
          zoom: 15
        });
    }

    render() {
        return (
            <div className="map" ref={div => this.mapWrap = div} />
        );
    }
}
