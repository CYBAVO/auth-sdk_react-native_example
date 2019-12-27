import {
  PAIRINGS_START_FETCH,
  PAIRINGS_FETCH_SUCCESS,
  PAIRINGS_FETCH_FAILED,
} from '../actions/pairings';

export default function pairings(
  state = {
    pairings: [],
    fetching: false,
    error: null,
  },
  action
) {
  switch (action.type) {
    case PAIRINGS_START_FETCH:
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case PAIRINGS_FETCH_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    case PAIRINGS_FETCH_SUCCESS:
      return {
        ...state,
        pairings: action.pairings,
        fetching: false,
        error: null,
      };
    default:
      return state;
  }
}
