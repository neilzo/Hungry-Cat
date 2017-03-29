import React, {Component} from 'react';
import '../public/core.css';
import BgImage from '../public/bg.jpg';
import getLocation from './utils/getLocation';

// Components
import Alert from './components/Alert';
import Landing from './components/Landing';
import HungryCat from './components/HungryCat';

class App extends Component {
    state = {
        loading: false,
        locationFound: false,
        position: {},
    };

    getFood = () => {
        this.setState({ loading: true });
        getLocation().then((position) => {
            this.setState({position: {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            }}, () => {
                this.setState({ loading: false, locationFound: true });
            });
        });
    };

    render() {
        const { loading, locationFound, position } = this.state;

        return (
            <div className="App">
                <Alert />
                {!locationFound && <div id="carousel" className="page-bgs">
                    <div style={{
                        backgroundImage: `url(${BgImage})`
                    }}></div>
                </div>}
                <main className="page-wrap container">
                    {!locationFound && <Landing
                                    loading={loading}
                                    getFood={this.getFood}
                              />
                    }
                    {locationFound && <HungryCat position={position} />}
                </main>
            </div>
        );
    }
}

export default App;
