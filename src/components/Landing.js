import React from 'react';

const Landing = ({ loading, getLocation }) => (
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
        <button className="btn btn-action" onClick={getLocation}>Find Some Food</button>
    </div>
);

Landing.propTypes = {
    loading: React.PropTypes.bool,
    getLocation: React.PropTypes.func,
};

export default Landing;
