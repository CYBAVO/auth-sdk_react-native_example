import { Service } from '../../Service';

export const ACTION_START_FETCH = 'ACTION_START_FETCH';
export const ACTION_FETCH_SUCCESS = 'ACTION_FETCH_SUCCESS';
export const ACTION_FETCH_FAILED = 'ACTION_FETCH_FAILED';

export function fetchActions() {
  const since = Date.now() / 1000 - 60 * 60 * 24;
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_START_FETCH });
    try {
      const authenticator = await Service.get();
      const {
        actions,
        updatedTime,
      } = await authenticator.getTwoFactorAuthentications(since);
      dispatch({ type: ACTION_FETCH_SUCCESS, actions, updatedTime });
    } catch (error) {
      console.warn('Authenticator.getTwoFactorAuthentications() failed', error);
      dispatch({ type: ACTION_FETCH_FAILED, error });
    }
  };
}
