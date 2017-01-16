import React from 'react';

const Nom = ({result: { name }}) => (
    <p>{name}</p>
);

const HungryCat = ({ results }) => (
    <div className="main-content">
        { results.map(result => <Nom result={result} />)}
        <button className="btn">Open Yelp Page</button>
        <button className="btn btn-action">Next</button>
    </div>
);

export default HungryCat;
