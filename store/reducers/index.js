import { combineReducers } from 'redux';
import pairings from './pairings';
import actions from './actions';
import notifications from './notifications';

const root = combineReducers({
  pairings,
  actions,
  notifications,
});

export default root;
