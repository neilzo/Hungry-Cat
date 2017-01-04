import React, {Component} from 'react';
import '../public/core.css';
import BgImage from '../public/bg.jpg';

// Components
import Alert from './components/Alert';
import Landing from './components/Landing';
import HungryCat from './components/HungryCat';

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
                <main className="page-wrap container">
                    {loading && <Landing loading={loading} /> }
                    {!loading && <HungryCat /> }
                </main>
            </div>
        );
    }
}

export default App;
