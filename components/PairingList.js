import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Body, ListItem, Left, Right, Icon, Button } from 'native-base';
import moment from 'moment';
import { textColorDisabled } from '../Constants';

const PairingList: () => React$Node = ({
  pairings: { pairings, fetching },
  onUnpair,
}) => {
  const _renderItem = ({ item }) => (
    <ListItem avatar>
      <Left>
        <Icon
          style={styles.icon}
          type="MaterialCommunityIcons"
          name="link-variant"
        />
      </Left>
      <Body>
        <Text numberOfLines={1} ellipsizeMode="middle">
          {item.deviceId}
        </Text>
        <Text note>{moment.unix(item.pairedAt).format('YYYY-MM-DD')}</Text>
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
  icon: {
    fontSize: 24,
    width: 24,
    color: textColorDisabled,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PairingList;
