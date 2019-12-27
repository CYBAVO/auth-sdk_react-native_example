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
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import moment from 'moment';
import { Authenticator } from '@cybavo/react-native-auth-service';
import {
  stateDesc,
  userActionDesc,
  getTitle,
  getBody,
} from '../utils/ActionHelper';
import { textColorDisabled, colorAccept, colorReject } from '../Constants';

const {
  TwoFactorAuthenticationAction: { UserAction },
} = Authenticator;

const CompletedActionScreen: () => React$Node = () => {
  const action = useNavigationParam('action');
  const { goBack } = useNavigation();

  const isAccept = UserAction.ACCEPT === action.userAction;

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
              style={[
                styles.figure,
                {
                  color: isAccept ? colorAccept : colorReject,
                },
              ]}
              type="MaterialCommunityIcons"
              name={action.inputPinCode ? 'shield-key' : 'shield-check'}
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

          <View style={styles.result}>
            <Text
              style={{
                color: isAccept ? colorAccept : colorReject,
              }}>
              {`${stateDesc(action)}/${userActionDesc(action)}`}
            </Text>
            <Text note>
              {moment.unix(action.updatedTime).format('YYYY/M/d HH:mm:ss')}
            </Text>
          </View>
        </Content>
      </Container>
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
  result: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
export default CompletedActionScreen;
