import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import {
  Container,
  Header,
  Body,
  Title,
  Left,
  Right,
  Button,
  Icon,
  Toast,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { fetchPairings } from '../store/actions';
import PairingList from '../components/PairingList';
import { Service } from '../Service';

const ManagePairingScreen: () => React$Node = () => {
  const pairings = useSelector(state => state.pairings);
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  useEffect(() => {
    dispatch(fetchPairings());
  }, [dispatch]);

  const confirmUnpair = pairing => {
    Alert.alert(
      'Unpair',
      `Do you want to unpair "${pairing.deviceId}"?`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Unpair',
          onPress: async () => {
            try {
              const authenticator = await Service.get();
              await authenticator.unpair([pairing.deviceId]);
            } catch (error) {
              console.warn(error);
              Toast.show({ text: error.message });
            }
          },
        },
      ],
      { cancelable: false }
    );
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
          <Title style={{ width: 200 }}>Pairing services</Title>
        </Body>
        <Right />
      </Header>
      <PairingList pairings={pairings} onUnpair={item => confirmUnpair(item)} />
    </Container>
  );
};

export default ManagePairingScreen;
