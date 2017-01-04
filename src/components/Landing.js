import React from 'react';

const Landing = ({ loading }) => (
    <div id="header" className="header">
        <h1 className="header-text">Hungry and indecisive right meow?</h1>
        <h3 className="header-subtext">Hungry Cat got this.</h3>
        {loading && <div id="ll" className="ll-wrap">
            <div className="loader">
                <span className="loader-item"></span>
                <span className="loader-item"></span>
                <span className="loader-item"></span>
            </div>
            <h5>Loading Your Location</h5>
        </div>}
        <button id="feelinLucky" className="btn btn-action" disabled>Find Some Food</button>
    </div>
);

Landing.propTypes = {
    loading: React.PropTypes.bool,
};

export default Landing;
