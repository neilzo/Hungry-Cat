import React from 'react';

const Nom = ({result: { name }}) => (
    <p>{name}</p>
);

const HungryCat = ({ results }) => (
    <div id="main" className="main-content">
        <div className="left-col">
            <button id="again" className="btn btn-action">I DON'T LIKE THIS</button>
            <span id="tip" className="tip">Click to keep wasting your time</span>
            <div id="results" className="results grid effect">
                { results.map(result => <Nom result={result} />)}
            </div>
        </div>
    </div>
);

export default HungryCat;
