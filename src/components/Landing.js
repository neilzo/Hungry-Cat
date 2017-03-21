import React from 'react';

const Landing = ({ loading, getFood }) => (
    <section className="header">
        {!loading && <h1 className="header-text">Hungry and indecisive right meow?</h1>}
        {!loading && <h3 className="header-subtext">Hungry Cat got this.</h3>}
        {loading && <h3 className="header-subtext">Hold tight!</h3>}
        {loading && <div className="ll-wrap">
            <div className="loader">
                <span className="loader-item"></span>
                <span className="loader-item"></span>
                <span className="loader-item"></span>
            </div>
            <h5>Fetching noms...</h5>
        </div>}
        {!loading && <button className="btn btn-action" onClick={getFood}>Find Some Food</button>}
    </section>
);

Landing.propTypes = {
    loading: React.PropTypes.bool,
    getLocation: React.PropTypes.func,
};

export default Landing;
