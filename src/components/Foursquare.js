import React, { Component } from 'react';
import { FetchFoursquare, FetchFood } from '../remote';

export default class Foursquare extends Component {
    static propTypes = {
        pos: React.PropTypes.object,
        name: React.PropTypes.string,
    };

    state = {
        venue: null,
    };

    componentDidMount() {
        const { pos: { lat, long }, name } = this.props;
        const data = {
            lat,
            long,
            query: name,
        };
        // FetchFoursquare(data).then((response) => {
        //     // gonna fix this :poop:
        //     const venue = response.response.venue;
        //     this.setState({ venue });
        // });

        FetchFood(data).then(response => console.log(response));
    }

    render() {
        const { venue } = this.state;
        return (
            <div className="info-wrap">
                {!venue && 'Loading Foursquare data...'}
                {venue && <div>
                    Foursquare rating: {venue.rating}
                </div>}
            </div>
        )
    }
}
