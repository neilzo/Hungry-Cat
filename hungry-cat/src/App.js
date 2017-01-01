import React, { Component } from 'react';
import '../../client/public/core.css';
import BgImage from '../public/bg.jpg';

class App extends Component {
  render() {
    return (
      <div className="App">
          <div id="carousel" className="page-bgs">
              <div style={{backgroundImage:`url(${BgImage})`}} alt="bg 1"></div>
          </div>
          <div id="alerts"></div>
          <div className="page-wrap container">
              <div id="header" className="header">
                  <h1 className="header-text">Hungry and indecisive right meow?</h1>
                  <h3 className="header-subtext">Hungry Cat got this.</h3>
                  <div id="ll" className="ll-wrap">
                      <div className="loader">
                          <span className="loader-item"></span>
                          <span className="loader-item"></span>
                          <span className="loader-item"></span>
                      </div>
                      <h5>Loading Your Location</h5>
              </div>
              <button id="feelinLucky" className="btn btn-action" disabled>Find Some Food</button>
            </div>
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
          </div>
      </div>
    );
  }
}

export default App;
