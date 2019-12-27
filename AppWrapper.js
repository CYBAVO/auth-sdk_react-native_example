import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import store from './store';
import AppNavigator from './AppNavigator';
import { clearNotifications } from './PushNotification';
import { Service } from './Service';
import { getPushToken } from './PushNotification';

const AppWrapper: () => React$Node = () => {
  const _handleAppStateChange = state => {
    // clear notifications when app active
    if (state === 'active') {
      clearNotifications();
    }
  };

  const _initPush = async () => {
    const authenticator = await Service.get();
    const pairings = await authenticator.getPairings();
    if (pairings.length > 0) {
      const token = await getPushToken();
      if (token) {
        authenticator.setPushToken(token);
      }
    }
  };

  // monitor app state
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  // update push token
  useEffect(() => {
    _initPush();
  }, []);

  return (
    <Provider store={store}>
      <Root>
        <AppNavigator />
      </Root>
    </Provider>
  );
};
export default AppWrapper;
