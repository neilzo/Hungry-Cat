import React, { Component } from 'react';
import { FetchFoursquare } from '../remote';

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
        FetchFoursquare(data).then((response) => {
            console.log('success!', response);
        });
    }

    render() {
        return (
            <div>
                SUP!
            </div>
        )
    }
}
