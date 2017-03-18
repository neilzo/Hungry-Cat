import React, { Component } from 'react';

export default class Foursquare extends Component {
    static propTypes = {
        pos: React.PropTypes.object,
        name: React.PropTypes.string,
    };

    componentDidMount() {
        const { pos: { lat, long }, name } = this.props;
        const data = {
            lat,
            long,
            query: name,
        };
        console.log(data);
        fetch(`/api/fq?`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(json => console.log(json));
    }

    render() {
        return (
            <div>
                SUP!
            </div>
        )
    }
}
