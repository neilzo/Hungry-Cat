import React, {Component} from 'react';
import '../../client/public/core.css';
import BgImage from '../public/bg.jpg';

// Components
import Alert from './components/Alert';
import Landing from './components/Landing';

class App extends Component {

    state = {
        loading: true,
    };

    componentDidMount() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.setState({loading: false}));
            }, 1500);
        });
    }

    render() {
        const { loading } = this.state;

        return (
            <div className="App">
                <div id="carousel" className="page-bgs">
                    <div style={{
                        backgroundImage: `url(${BgImage})`
                    }} alt="bg 1"></div>
                </div>
                <Alert/>
                <div className="page-wrap container">
                    <Landing loading={loading} />
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
