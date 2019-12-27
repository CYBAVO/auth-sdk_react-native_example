import React from 'react';
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
} from 'native-base';
import { useNavigation } from 'react-navigation-hooks';
import { colorPrimary } from '../Constants';

const FinishPairingScreen: () => React$Node = () => {
  const { navigate, goBack } = useNavigation();

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
          <Icon
            style={styles.figure}
            type="MaterialCommunityIcons"
            name="shield-lock"
          />
          <Text>Congratulations! This device was paired successfully!</Text>
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
export default FinishPairingScreen;
