import React, {Component} from 'react';
import '../public/core.css';
import BgImage from '../public/bg.jpg';
import getLocation from './utils/getLocation';

// Components
import Alert from './components/Alert';
import Landing from './components/Landing';
import HungryCat from './components/HungryCat';

export const options = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'private,max-age=0,no-cache,no-store',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
};

class App extends Component {

    state = {
        loading: false,
        done: false,
        position: {},
    };

    getFood = () => {
        this.setState({loading: true});
        getLocation().then((position) => {
            this.setState({position: {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            }}, () => {
                this.setState({loading: false, done: true});
            });
        });
    };

    render() {
        const { loading, done, position } = this.state;

        return (
            <div className="App">
                <Alert />
                {!done && <div id="carousel" className="page-bgs">
                    <div style={{
                        backgroundImage: `url(${BgImage})`
                    }}></div>
                </div>}
                <main className="page-wrap container">
                    {!done && <Landing
                                    loading={loading}
                                    getFood={this.getFood}
                              />
                    }
                    {done && <HungryCat position={position} />}
                </main>
            </div>
        );
    }
}

export default App;
