import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Text,
  Container,
  Content,
  Header,
  Left,
  Right,
  Body,
  Title,
  Icon,
  Button,
  Toast,
} from 'native-base';
import { useDispatch } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { Authenticator } from '@cybavo/react-native-auth-service';
import InputMessageModal from '../components/InputMessageModal';
import { Service } from '../Service';
import { getPushToken } from '../PushNotification';
import { colorPrimary } from '../Constants';
import { fetchActions } from '../store/actions';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const { ErrorCodes } = Authenticator;

const NewPairingScreen: () => React$Node = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputToken, showInputToken] = useState(false);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  useEffect(() => {
    async function pairDevice(pairingToken) {
      setLoading(true);
      try {
        const authenticator = await Service.get();
        const pushToken = await getPushToken();
        const { deviceId } = await authenticator.pair(
          pairingToken,
          pushToken || '',
          {}
        );
        navigate('Finish', { deviceId });
      } catch (error) {
        console.warn('Authenticator.pair() failed', error);
        let errorMsg = error.message;
        if (error.code === ErrorCodes.ErrDeviceInsecure) {
          // device security error
          if (error.userInfo && error.userInfo.errors) {
            errorMsg = `${error.message} (${error.userInfo.errors.join(',')})`;
          }
        }
        Toast.show({ text: errorMsg });
      }
      setToken('');
      setLoading(false);
    }
    if (token) {
      pairDevice(token);
    }
  }, [dispatch, navigate, token]);
  const _onResult = (deviceId, errorMsg) => {
    try {
      if (deviceId) {
        navigate('Finish', { deviceId });
      } else if (errorMsg) {
        Toast.show({ text: errorMsg });
      } else {
        Toast.show({ text: 'no errorMsg' });
      }
    } catch (error) {
      console.warn(error);
      Toast.show({ text: error.message });
    }
  };
  return (
    <>
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigate('Main')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>New Pairing</Title>
          </Body>
          <Right />
        </Header>
        <Content contentContainerStyle={styles.contentContainer}>
          <View style={styles.body}>
            <Icon
              style={styles.figure}
              type="MaterialCommunityIcons"
              name="qrcode-scan"
            />
            <Text>Scan QR code shows on web page</Text>
          </View>
          <Button
            style={styles.button}
            block
            transparent
            disabled={loading}
            onPress={() => showInputToken(true)}>
            <Text>Input token</Text>
          </Button>
          <Button
            style={styles.button}
            block
            disabled={loading}
            onPress={async () => {
              const pushDeviceToken = await getPushToken();
              const { endpoint, apiCode } = await Service.getConfig();
              let permission =
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.CAMERA
                  : PERMISSIONS.ANDROID.CAMERA;
              request(permission)
                .then(result => {
                  switch (result) {
                    case RESULTS.GRANTED:
                      console.log('The permission is granted');
                      navigate('Scan', {
                        onResult: _onResult,
                        endpoint: endpoint,
                        apiCode: apiCode,
                        pushDeviceToken: pushDeviceToken,
                      });
                      break;
                    default:
                      console.log('permission result:' + result);
                      break;
                  }
                })
                .catch(error => {
                  console.log(error.message);
                });
            }}>
            <Text>Scan</Text>
          </Button>
        </Content>
      </Container>
      <InputMessageModal
        visible={inputToken}
        title="Input token"
        placeholder="Input pairing token"
        onCancel={() => showInputToken(false)}
        onConfirm={message => {
          showInputToken(false);
          setToken(message);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  figure: {
    fontSize: 128,
    color: colorPrimary,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 8,
  },
});
export default NewPairingScreen;
