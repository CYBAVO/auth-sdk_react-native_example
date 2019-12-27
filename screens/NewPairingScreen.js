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
import InputMessageModal from '../components/InputMessageModal';
import { Service } from '../Service';
import { getPushToken } from '../PushNotification';
import { colorPrimary } from '../Constants';

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
        await authenticator.pair(pairingToken, pushToken || '', {});
        navigate('Finish');
      } catch (error) {
        console.warn('Authenticator.pair() failed', error);
        Toast.show({ text: error.message });
      }
      setToken('');
      setLoading(false);
    }
    if (token) {
      pairDevice(token);
    }
  }, [dispatch, navigate, token]);

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
            onPress={() => {
              navigate('Scan', {
                onResult: setToken,
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
