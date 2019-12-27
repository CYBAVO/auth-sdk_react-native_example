import React, { useState } from 'react';
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
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import moment from 'moment';
import InputMessageModal from '../components/InputMessageModal';
import { Service } from '../Service';
import { fetchActions } from '../store/actions';
import { getTitle, getBody } from '../utils/ActionHelper';
import { colorPrimary, textColorDisabled } from '../Constants';

const OTPActionScreen: () => React$Node = () => {
  const [loading, setLoading] = useState(false);
  const [approve, setApprove] = useState(null);
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const action = useNavigationParam('action');

  const _approve = async message => {
    setLoading(true);
    try {
      const authenticator = await Service.get();
      await authenticator.approve(action.token, action.deviceId, message);
      dispatch(fetchActions());
      goBack();
    } catch (error) {
      console.warn(error);
      Toast.show({ text: error.message });
    }
    setLoading(false);
  };

  const _reject = async message => {
    setLoading(true);
    try {
      const authenticator = await Service.get();
      await authenticator.reject(action.token, action.deviceId, message);
      dispatch(fetchActions());
      goBack();
      setApprove(null);
    } catch (error) {
      console.warn(error);
      Toast.show({ text: error.message });
    }
    setLoading(false);
  };

  return (
    <>
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={{ width: 200 }}>{getTitle(action)}</Title>
          </Body>
          <Right />
        </Header>
        <Content contentContainerStyle={styles.contentContainer}>
          <Text style={styles.type}>{action.messageType}</Text>
          <View style={styles.body}>
            <Icon
              style={styles.figure}
              type="MaterialCommunityIcons"
              name="shield-check"
            />
            <Text numberOfLines={1} style={styles.actionBody}>
              {getBody(action)}
            </Text>
            {!!action.messageData && (
              <Text note style={styles.actionData}>
                {action.messageData}
              </Text>
            )}
            <Text note>
              {moment.unix(action.createTime).format('YYYY/M/d HH:mm:ss')}
            </Text>
          </View>
          <View style={styles.footer}>
            <Button
              style={styles.button}
              block
              disabled={loading}
              onPress={() => setApprove(true)}>
              <Text>Accept</Text>
            </Button>
            {action.rejectable && (
              <Button
                danger
                style={styles.button}
                block
                disabled={loading}
                onPress={() => setApprove(false)}>
                <Text>Reject</Text>
              </Button>
            )}
          </View>
        </Content>
      </Container>
      <InputMessageModal
        visible={approve != null}
        title="Input message"
        placeholder="Leave a message"
        onCancel={() => setApprove(null)}
        onConfirm={message => {
          if (approve === true) {
            // approve
            _approve(message);
          } else if (approve === false) {
            // reject
            _reject(message);
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  type: {
    position: 'absolute',
    right: 8,
    top: 8,
    alignSelf: 'flex-end',
    backgroundColor: textColorDisabled,
    color: 'white',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
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
  actionBody: {
    textAlign: 'center',
  },
  actionData: {
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  button: {
    marginHorizontal: 8,
    flex: 1,
  },
});
export default OTPActionScreen;
