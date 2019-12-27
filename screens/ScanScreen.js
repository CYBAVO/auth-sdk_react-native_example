import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Right,
  Body,
  Title,
  Icon,
  Button,
} from 'native-base';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { colorPrimary } from '../Constants';

const ScanScreen: () => React$Node = () => {
  const [qrCode, setQrCode] = useState('');
  const { goBack } = useNavigation();
  const onResult = useNavigationParam('onResult');

  useEffect(() => {
    if (qrCode) {
      if (onResult) {
        onResult(qrCode);
      }
      goBack();
    }
  }, [goBack, onResult, qrCode]);

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Scan</Title>
        </Body>
        <Right />
      </Header>
      <Content contentContainerStyle={styles.contentContainer}>
        <QRCodeScanner
          showMarker
          checkAndroid6Permissions
          cameraProps={{
            style: {
              width: '100%',
              height: '100%',
            },
          }}
          markerStyle={{
            borderColor: colorPrimary,
          }}
          onRead={e => setQrCode(e.data)}
        />
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
export default ScanScreen;
