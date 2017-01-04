import { combineReducers } from 'redux';

const results = ((state) => {
    return [];
});

const lat = ((state) => {
    return '';
});

const long = ((state) => {
    return '';
});

export const rootReducer = combineReducers({
    results,
    lat,
    long,
});
