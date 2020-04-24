import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Platform, AppState } from 'react-native';
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
  Text,
} from 'native-base';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import {
  ScanPairView,
  PairImagePicker,
  Authenticator,
} from '@cybavo/react-native-auth-service';
const { PairMode } = Authenticator;
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { width, height } = Dimensions.get('window');
const ScanScreen: () => React$Node = () => {
  const [pairResult, setPairResult] = useState({});
  const { goBack } = useNavigation();
  const endpoint = useNavigationParam('endpoint');
  const apiCode = useNavigationParam('apiCode');
  const pushDeviceToken = useNavigationParam('pushDeviceToken');
  const onResult = useNavigationParam('onResult');

  useEffect(() => {
    PairImagePicker.addListener('onPairResult', _onResult);
    return () => {
      PairImagePicker.removeListener('onPairResult', _onResult);
    };
  }, []);

  const _onResult = result => {
    goBack();
    if (onResult) {
      onResult(result.deviceId, result.errorMsg);
    }
  };
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
        <Right>
          <Button
            transparent
            onPress={async () => {
              if (Platform.OS != 'ios') {
                let result = await request(
                  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
                );
                if (result != RESULTS.GRANTED) {
                  return;
                }
              }
              PairImagePicker.start(
                endpoint,
                apiCode,
                pushDeviceToken,
                PairMode.TOKEN
              );
            }}>
            <Text>Pick</Text>
          </Button>
        </Right>
      </Header>
      <Content contentContainerStyle={styles.contentContainer}>
        <ScanPairView
          width={width}
          height={height}
          endPoint={endpoint}
          apiCode={apiCode}
          pushDeviceToken={pushDeviceToken}
          mode={PairMode.TOKEN}
          onPairResult={(deviceId, errorMsg) => {
            _onResult({ deviceId, errorMsg });
          }}
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
