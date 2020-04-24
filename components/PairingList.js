import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  Text,
  Body,
  ListItem,
  Left,
  Right,
  Icon,
  Button,
  Thumbnail,
} from 'native-base';
import moment from 'moment';
import { textColorDisabled } from '../Constants';

const PairingList: () => React$Node = ({
  pairings: { pairings, fetching },
  onUnpair,
}) => {
  const _renderItem = ({ item }) => (
    <ListItem avatar style={{ opacity: item.isValid ? 1 : 0.5 }}>
      <Left>
        {!!item.iconUrl && (
          <Thumbnail style={styles.iconImage} source={{ uri: item.iconUrl }} />
        )}
        {!item.iconUrl && (
          <Icon
            style={styles.iconFallback}
            type="MaterialCommunityIcons"
            name="link-variant"
          />
        )}
      </Left>
      <Body>
        <Text style={styles.serviceName}>
          {item.isValid
            ? item.serviceName
            : `(Disconnected) ${item.serviceName}`}
        </Text>
        <Text
          style={
            styles.serviceName
          }>{`${item.userName} <${item.userEmail}>, ${item.userAccount}`}</Text>
        <Text style={styles.serviceId} numberOfLines={1} ellipsizeMode="middle">
          {item.deviceId}
        </Text>
        <Text note style={styles.pairedAt}>
          {moment.unix(item.pairedAt).format('YYYY-MM-DD')}
        </Text>
      </Body>
      <Right>
        <Button
          style={{ height: 30 }}
          danger
          transparent
          onPress={() => onUnpair(item)}>
          <Text>Unpair</Text>
        </Button>
      </Right>
    </ListItem>
  );

  return (
    <>
      {pairings.length > 0 && (
        <FlatList
          data={pairings}
          keyExtractor={pairing => pairing.deviceId}
          renderItem={_renderItem}
        />
      )}
      {pairings.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text>It seems that you have no pairings.</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconFallback: {
    fontSize: 24,
    width: 24,
    color: textColorDisabled,
  },
  serviceName: {},
  user: {
    opacity: 0.75,
  },
  serviceId: {
    fontSize: 14,
    opacity: 0.5,
  },
  pairedAt: {},
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PairingList;
