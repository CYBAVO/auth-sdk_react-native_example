import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Body, ListItem, Icon } from 'native-base';
import moment from 'moment';
import { Authenticator } from '@cybavo/react-native-auth-service';
import { stateDesc, userActionDesc, getTitle } from '../utils/ActionHelper';
import {
  textColorDisabled,
  colorAccept,
  colorReject,
  colorPrimary,
} from '../Constants';

const {
  TwoFactorAuthenticationAction: { State, UserAction },
} = Authenticator;

const bulletColor = userAction => {
  switch (userAction) {
    case UserAction.NONE:
      return textColorDisabled;
    case UserAction.ACCEPT:
      return colorAccept;
    case UserAction.REJECT:
      return colorReject;
    default:
      return 'black';
  }
};

const PairingList: () => React$Node = ({
  actions: { actions, fetching },
  pairings: { pairings = [] },
  onPressItem,
  onRefresh,
}) => {
  console.log(pairings);
  const _renderItem = ({ item }) => (
    <ListItem
      style={[
        styles.listItem,
        { opacity: item.state === State.CREATED ? 1 : 0.5 },
      ]}
      button
      onPress={() => onPressItem(item)}>
      <View
        style={[
          styles.bullet,
          {
            backgroundColor: bulletColor(item.userAction),
          },
        ]}
      />
      <Body>
        <Text numberOfLines={1} ellipsizeMode="middle">
          {getTitle(item)}
        </Text>
        <Text numberOfLines={1} style={styles.serviceName}>
          {pairings.find(p => p.deviceId === item.deviceId).serviceName}
        </Text>
        <Text
          note
          numberOfLines={1}
          ellipsizeMode="middle"
          style={styles.deviceId}>
          {item.deviceId}
        </Text>
        <Text note style={styles.state}>
          {`${stateDesc(item)}/${userActionDesc(item)}`}
        </Text>
      </Body>
      <View style={styles.right}>
        <Text note>{moment.unix(item.createTime).format('M/d HH:mm')}</Text>
        {item.messageType !== 0 && (
          <Text style={styles.messageType}>{item.messageType}</Text>
        )}
        <Icon
          type="MaterialCommunityIcons"
          name={item.inputPinCode ? 'shield-key' : 'shield-check'}
          style={styles.icon}
        />
      </View>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={actions}
        keyExtractor={action => action.token}
        renderItem={_renderItem}
        refreshing={fetching}
        onRefresh={onRefresh}
      />
      {actions.length === 0 && (
        <View style={styles.emptyContainer}>
          <Icon
            type="MaterialCommunityIcons"
            name="shield-check-outline"
            style={styles.figure}
          />
          <Text>All set!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  list: {
    flex: 1,
  },
  listItem: {
    marginLeft: 0,
    paddingRight: 4,
  },
  bullet: {
    width: 4,
    height: 32,
  },
  serviceName: {
    opacity: 0.75,
  },
  deviceId: {},
  state: {
    opacity: 0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageType: {
    backgroundColor: textColorDisabled,
    color: 'white',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginHorizontal: 4,
    fontSize: 12,
  },
  icon: {
    fontSize: 24,
    width: 24,
    color: colorPrimary,
  },
  emptyContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  figure: {
    fontSize: 128,
    color: colorPrimary,
  },
});

export default PairingList;
