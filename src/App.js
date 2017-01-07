import React, {Component} from 'react';
import '../public/core.css';
import BgImage from '../public/bg.jpg';

// Components
import Alert from './components/Alert';
import Landing from './components/Landing';
import HungryCat from './components/HungryCat';

class App extends Component {

    state = {
        loading: false,
        done: false,
        position: {},
    };

    getLocation = () => {
        this.setState({loading: true});
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(position);
                }, (error) => {
                    reject(error);
                }, {
                    maximumAge: 30000,
                    timeout: 27000
                });
            } else {
                reject({error: {message: 'Geolocation Unavailable'}});
            }
        }).then((position) => {
            return this.setState({position: position.coords}, () => {
                console.log(this.state);
                return fetch('/api/test')
                    .then(response => response.json())
                    .then(results => {
                        console.log(results);
                        this.setState({loading: false, done: true});
                    });
            });
        });
    };

    render() {
        const { loading, done } = this.state;

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
                                    getLocation={this.getLocation}
                              />
                    }
                    {done && <HungryCat /> }
                </main>
            </div>
        );
    }
}

export default App;
