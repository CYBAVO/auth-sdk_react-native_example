import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import reducer from './reducers';

const logger = createLogger();
const store = createStore(reducer, applyMiddleware(ReduxThunk, logger));

export default store;
