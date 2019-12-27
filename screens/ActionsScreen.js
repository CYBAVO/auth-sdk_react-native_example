import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  Container,
  Content,
  Header,
  Body,
  Title,
  Icon,
  Button,
  Left,
  Right,
  Toast,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { Authenticator } from '@cybavo/react-native-auth-service';
import ActionList from '../components/ActionList';
import { fetchPairings, fetchActions } from '../store/actions';
import { colorPrimary } from '../Constants';

const {
  TwoFactorAuthenticationAction: { State },
} = Authenticator;

const ActionsScreen: () => React$Node = () => {
  const pairings = useSelector(state => state.pairings);
  const actions = useSelector(state => state.actions);
  const { notifications } = useSelector(state => state.notifications);
  const [refresh, setRefresh] = useState(true);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  useEffect(() => {
    dispatch(fetchPairings());
  }, [dispatch]);

  useEffect(() => {
    if (pairings && pairings.pairings.length && refresh) {
      dispatch(fetchActions());
      setRefresh(false);
    }
  }, [dispatch, pairings, refresh]);

  useEffect(() => {
    setRefresh(true);
  }, [notifications]);

  useEffect(() => {
    if (actions.error) {
      Toast.show({ text: actions.error.message });
    }
  }, [actions]);

  return (
    <Container>
      <Header noLeft>
        <Left />
        <Body>
          <Title>Actions</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon
              type="MaterialCommunityIcons"
              name="link-plus"
              onPress={() => navigate('NewPairing')}
            />
          </Button>
        </Right>
      </Header>
      {pairings.pairings.length > 0 && (
        <ActionList
          actions={actions}
          onRefresh={() => setRefresh(true)}
          onPressItem={action => {
            navigate(
              action.state === State.CREATED
                ? action.inputPinCode
                  ? 'PINCodeAction'
                  : 'OTPAction'
                : 'CompletedAction',
              { action }
            );
          }}
        />
      )}
      {pairings.pairings.length === 0 && (
        <Content contentContainerStyle={styles.emptyContainer}>
          <Icon
            style={styles.figure}
            type="MaterialCommunityIcons"
            name="shield-link-variant-outline"
          />
          <Text>It seems that you have no pairings.</Text>
          <Button
            onPress={() => {
              navigate('NewPairing');
            }}>
            <Text>Pair Now!</Text>
          </Button>
        </Content>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  figure: {
    fontSize: 128,
    color: colorPrimary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ActionsScreen;
