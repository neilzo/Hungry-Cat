import React, { Component } from 'react'

export default class Map extends Component {
    map = null;

    componentDidMount() {
        this.map = new window.google.maps.Map(this.mapWrap, {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
    }

    render() {
        return (
            <div className="map" ref={div => this.mapWrap = div} />
        );
    }
}
