import { createStore, compose } from 'redux';
// import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

/**
 * This file is mostly for setting up the store you shouldn't need to change anything in here.
 */


const finalCreateStore = compose(
    // applyMiddleware(thunk),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
)(createStore);

const initializeStore = (initialState = {}) => {
    const _store = finalCreateStore(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers/index').rootReducer;
            _store.replaceReducer(nextRootReducer);
        });
    }

    return _store;
};

export default initializeStore;
