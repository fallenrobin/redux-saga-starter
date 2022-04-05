import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import logger from 'redux-logger';
import axios from 'axios';


const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};

function* fetchElements() {
    //GET request!
    try { //'try this stuff!'
        let response = yield axios.get('/api/element')
        console.log(response.data);
        //in saga-land 'put' = dispatch 
        yield put({ type: 'SET_ELEMENTS', payload: response.data });
    } catch (err) {
        console.log(err);
    }

}

function* addElement(action) {
    // needs action.payload
    try {
        yield axios.post('/api/element', action.payload);
        yield put({ type: 'FETCH_ELEMENTS' });
    } catch (err) {
        console.log(err);
    }

}

// this is the saga that will watch for actions (saga sushi boats) (function* is a generator)
function* watcherSaga() {
    // yield is our 'pause' here (only for use in Generator function)
    yield takeEvery('FETCH_ELEMENTS', fetchElements);
    yield takeEvery('ADD_ELEMENT', addElement);
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(watcherSaga);

ReactDOM.render(
    <Provider store={storeInstance}>
        <App />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
