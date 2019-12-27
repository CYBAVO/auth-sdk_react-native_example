import { Service } from '../../Service';

export const PAIRINGS_START_FETCH = 'PAIRINGS_START_FETCH';
export const PAIRINGS_FETCH_SUCCESS = 'PAIRINGS_FETCH_SUCCESS';
export const PAIRINGS_FETCH_FAILED = 'PAIRINGS_FETCH_FAILED';

let init = false;
export function fetchPairings() {
  return async (dispatch, getState) => {
    dispatch({ type: PAIRINGS_START_FETCH });
    try {
      const authenticator = await Service.get();
      if (!init) {
        // register pairing listener for the first time
        authenticator.addPairingStateListener(() => {
          console.log('onPairingStateChange');
          dispatch(fetchPairings());
        });
        init = true;
      }
      const pairings = await authenticator.getPairings();
      dispatch({ type: PAIRINGS_FETCH_SUCCESS, pairings });
    } catch (error) {
      console.warn('Authenticator.getPairings() failed', error);
      dispatch({ type: PAIRINGS_FETCH_FAILED, error });
    }
  };
}
