import React from 'react';
import ReactDOM from 'react-dom';
import 'promise';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import initializeStore from './store';

const initialState = {
    results: [],
    lat: '',
    long: '',
};

const store = initializeStore(initialState);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('root')
);
