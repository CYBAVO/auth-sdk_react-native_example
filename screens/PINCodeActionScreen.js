import React, { useState, useRef } from 'react';
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
import { NumericPinCodeInputView } from '@cybavo/react-native-auth-service';
import InputMessageModal from '../components/InputMessageModal';
import { Service } from '../Service';
import { fetchActions } from '../store/actions';
import { getTitle, getBody } from '../utils/ActionHelper';
import { PIN_CODE_LENGTH, colorPrimary, textColorDisabled } from '../Constants';

const PINCodeActionScreen: () => React$Node = () => {
  const [loading, setLoading] = useState(false);
  const [approve, setApprove] = useState(null);
  const [pinCodeLength, setPinCodeLength] = useState(0);
  const dispatch = useDispatch();
  const pinCodeInput = useRef(null);
  const { goBack } = useNavigation();
  const action = useNavigationParam('action');

  const _approve = async message => {
    setLoading(true);
    try {
      const pinSecret = await pinCodeInput.current.submit();
      const authenticator = await Service.get();
      await authenticator.approve(
        action.token,
        action.deviceId,
        message,
        pinSecret
      );
      dispatch(fetchActions());
      goBack();
    } catch (error) {
      setApprove(null);
      pinCodeInput.current.clear();
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
            <Text numberOfLines={1} style={styles.actionBody}>
              {getBody(action)}
            </Text>
            {!!action.messageData && (
              <Text note numberOfLines={3} style={styles.actionData}>
                {action.messageData}
              </Text>
            )}
            <Text note>
              {moment.unix(action.createTime).format('YYYY/M/d HH:mm:ss')}
            </Text>
            <Text style={styles.pinCode}>
              {`${'*'.repeat(pinCodeLength)}${'-'.repeat(
                PIN_CODE_LENGTH - pinCodeLength
              )}`}
            </Text>
            <NumericPinCodeInputView
              ref={pinCodeInput}
              style={styles.pinCodeInput}
              maxLength={PIN_CODE_LENGTH}
              hapticFeedback={true}
              horizontalSpacing={16}
              verticalSpacing={8}
              buttonWidth={72}
              buttonHeight={72}
              buttonBorderRadius={36}
              buttonBackgroundColor="#EEEEEE80"
              buttonTextColor="black"
              buttonTextSize={12}
              backspaceButtonWidth={72}
              backspaceButtonHeight={72}
              backspaceButtonBorderRadius={36}
              backspaceButtonBackgroundColor="#EEEEEE80"
              buttonBackgroundColorDisabled="#EEEEEE"
              backspaceButtonTextColor="black"
              buttonTextColorDisabled="black"
              backspaceButtonTextColorDisabled="black"
              backspaceButtonTextSize={12}
              backspaceButtonBackgroundColorDisabled="#EEEEEE"
              androidButtonRippleColor="#80808080"
              disabled={loading}
              onChanged={setPinCodeLength}
            />
          </View>
          <View style={styles.footer}>
            <Button
              style={styles.button}
              block
              disabled={loading || pinCodeLength !== PIN_CODE_LENGTH}
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
  pinCode: {
    color: colorPrimary,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 16,
    marginTop: 16,
  },
  pinCodeInput: {
    alignSelf: 'center',
    marginTop: 16,
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
export default PINCodeActionScreen;
