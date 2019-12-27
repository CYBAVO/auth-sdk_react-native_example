import {
  ACTION_START_FETCH,
  ACTION_FETCH_SUCCESS,
  ACTION_FETCH_FAILED,
} from '../actions/actions';

export default function actions(
  state = {
    actions: [],
    updatedTime: 0,
    fetching: false,
    error: null,
  },
  action
) {
  switch (action.type) {
    case ACTION_START_FETCH:
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case ACTION_FETCH_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    case ACTION_FETCH_SUCCESS:
      return {
        ...state,
        actions: action.actions,
        updatedTime: action.updatedTime,
        fetching: false,
        error: null,
      };
    default:
      return state;
  }
}
