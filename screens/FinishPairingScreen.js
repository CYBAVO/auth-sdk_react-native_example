import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
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
  Thumbnail,
} from 'native-base';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { colorPrimary } from '../Constants';

const FinishPairingScreen: () => React$Node = () => {
  const { navigate, goBack } = useNavigation();
  const { pairings } = useSelector(state => state.pairings);
  const deviceId = useNavigationParam('deviceId');
  const paired = pairings.find(p => p.deviceId === deviceId) || {};

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Finish</Title>
        </Body>
        <Right />
      </Header>
      <Content contentContainerStyle={styles.contentContainer}>
        <View style={styles.body}>
          {!!paired.iconUrl && (
            <Thumbnail
              source={{ uri: paired.iconUrl }}
              style={styles.figureImage}
            />
          )}
          {!paired.iconUrl && (
            <Icon
              style={styles.figureIcon}
              type="MaterialCommunityIcons"
              name="shield-lock"
            />
          )}
          <Text style={styles.serviceName}>{paired.serviceName}</Text>
          <Text style={styles.message}>
            Congratulations! This device was paired successfully!
          </Text>
        </View>
        <Button
          style={styles.button}
          block
          onPress={() => {
            navigate('Main');
          }}>
          <Text>Done</Text>
        </Button>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  figureImage: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
  },
  figureIcon: {
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
  serviceName: {
    textAlign: 'center',
    marginTop: 16,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.5,
  },
  button: {
    marginTop: 8,
  },
});
export default FinishPairingScreen;
