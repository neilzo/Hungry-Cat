import React from 'react';

const HungryCat = () => (
    <div id="main" className="main-content">
        <div className="left-col">
            <button id="again" className="btn btn-action">I DON'T LIKE THIS</button>
            <span id="tip" className="tip">Click to keep wasting your time</span>
            <div id="results" className="results grid effect"></div>
        </div>
        <div className="right-col">
            <div id="tripDetails" className="trip-details-wrap"></div>
            <div className="mobile-open">
                <a id="openMap" href="#">Open in Mobile Map App</a>
            </div>
            <div id="map" className="map"></div>
        </div>
    </div>
);

export default HungryCat;
