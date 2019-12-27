import { PushNotification } from '@cybavo/react-native-auth-service';
import RNPushNotification from 'react-native-push-notification';
import iid from '@react-native-firebase/iid';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import store from './store';
import { Service } from './Service';
import { newNotifications } from './store/actions/notifications';

const onRemoteNotificationIos = notification => {
  console.log('onNotification', notification);
  if (!notification.data || !notification.data.data) {
    return;
  }
  const payload = notification.data.data.jsonBody;
  if (!payload) {
    return;
  }
  console.log('localNotification');
  store.dispatch(newNotifications(payload));
  RNPushNotification.localNotification({
    id: '120',
    title: 'New Action',
    message: '',
    vibrate: true,
  });
};
/** iOS*/
PushNotificationIOS.addEventListener('register', token => {
  console.log('AWSPushNotification.onRegister', token);
  AsyncStorage.setItem('pushDeviceToken', token).then(() =>
    console.debug('save pushDeviceToken done')
  );
});
/** iOS*/
// PushNotificationIOS.addEventListener('notification', onRemoteNotificationIos);

/** iOS*/
PushNotificationIOS.addEventListener('registrationError', registrationError => {
  console.log(registrationError, '--');
});
const NOTIFICATION_ID = 99;

RNPushNotification.configure({
  popInitialNotification: true,
  requestPermissions: true,
  onRegister: async token => {
    console.log('onRegister:', token);
    const authenticator = await Service.get();
    try {
      const pairings = await authenticator.getPairings();
      if (pairings.length > 0) {
        await authenticator.setPushToken(token.token);
      }
    } catch (error) {
      console.warn('authenticator.setPushToken failed', error);
    }
  },
  onNotification: notification => {
    console.log('onNotification', notification);
    if (Platform.OS === 'ios') {
      // required on iOS only (see fetchCompletionHandler docs:
      // https://github.com/react-native-community/react-native-push-notification-ios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
      onRemoteNotificationIos(notification);
      return;
    }
    const payload = notification['pinpoint.jsonBody'];
    if (!payload) {
      return;
    }
    const body = PushNotification.parse(payload);
    store.dispatch(newNotifications(body.actions));

    // show local notification
    RNPushNotification.localNotification({
      id: NOTIFICATION_ID,
      title: 'TBD',
      message: 'TBD',
    });
  },
});

/** iOS*/
// PushNotificationIOS.requestPermissions();

export function getPushToken() {
  if (Platform.OS === 'ios') {
    return AsyncStorage.getItem('pushDeviceToken');
  } else {
    // use firebsae instance id since for some reason react-native-push-notification onRegister not invoked
    // TODO: may need to return APNS token for iOS
    return iid().getToken();
  }
}
export function clearNotifications() {
  RNPushNotification.cancelLocalNotifications({ id: NOTIFICATION_ID });
}
