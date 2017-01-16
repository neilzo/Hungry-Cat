import React from 'react';
import Map from './Map';

const HungryCat = ({ position }) => (
    <div className="main-content">
        <Map position={position} />
        <button className="btn btn-action">Next</button>
    </div>
);

HungryCat.propTypes = {
    position: React.PropTypes.object,
};

export default HungryCat;
