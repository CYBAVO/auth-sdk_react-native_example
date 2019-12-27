import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  Container,
  Content,
  Header,
  Body,
  Title,
  List,
  ListItem,
  Left,
  Icon,
  Toast,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { Authenticator } from '@cybavo/react-native-auth-service';
import InputMessageModal from '../components/InputMessageModal';
import { fetchPairings } from '../store/actions';
import { Service } from '../Service';
import { textColorDisabled } from '../Constants';

const {
  SDKInfo: { VERSION_NAME, VERSION_CODE, BUILD_TYPE },
} = Authenticator;

const SettingsScreen: () => React$Node = () => {
  const pairingCount = useSelector(state => state.pairings.pairings.length);
  const [config, setConfig] = useState({});
  const [editing, setEditing] = useState(null);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  useEffect(() => {
    // load config
    Service.getConfig().then(setConfig);
  }, []);

  useEffect(() => {
    // fetch parings
    dispatch(fetchPairings());
  }, [dispatch]);

  const changeConfig = async newConfig => {
    if (newConfig.endpoint && newConfig.apiCode) {
      await Service.setConfig(newConfig);
      setConfig(newConfig);
      Toast.show({
        text:
          'This changing will take effect the next time you restart the app',
      });
    }
  };
  return (
    <>
      <Container>
        <Header noLeft>
          <Body>
            <Title>Settings</Title>
          </Body>
        </Header>

        <Content>
          <List>
            <ListItem itemHeader first>
              <Text>Pairings</Text>
            </ListItem>
            <ListItem avatar button onPress={() => navigate('ManagePairing')}>
              <Left>
                <Icon
                  style={styles.icon}
                  type="MaterialCommunityIcons"
                  name="link-variant"
                />
              </Left>
              <Body>
                <Text>Pairing services</Text>
                <Text note>{`${pairingCount} pairing(s)`}</Text>
              </Body>
            </ListItem>
            <ListItem itemHeader>
              <Text>Development</Text>
            </ListItem>
            <ListItem avatar button onPress={() => setEditing('endpoint')}>
              <Left>
                <Icon
                  style={styles.icon}
                  type="MaterialCommunityIcons"
                  name="cloud-tags"
                />
              </Left>
              <Body>
                <Text>Service endpoint</Text>
                <Text note>{config.endpoint}</Text>
              </Body>
            </ListItem>
            <ListItem avatar button onPress={() => setEditing('apiCode')}>
              <Left>
                <Icon
                  style={styles.icon}
                  type="MaterialCommunityIcons"
                  name="code-not-equal-variant"
                />
              </Left>
              <Body>
                <Text>API code</Text>
                <Text note>{config.apiCode}</Text>
              </Body>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Icon
                  style={styles.icon}
                  type="MaterialCommunityIcons"
                  name="android-debug-bridge"
                />
              </Left>
              <Body>
                <Text>SDK version</Text>
                <Text note>
                  {`${VERSION_NAME} (${VERSION_CODE}) - ${BUILD_TYPE}`}
                </Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
      <InputMessageModal
        visible={!!editing}
        title={`Change ${editing}`}
        placeholder={`Input ${editing}`}
        value={config[editing]}
        onCancel={() => setEditing(null)}
        onConfirm={message => {
          changeConfig({
            ...config,
            [editing]: message,
          });
          setEditing(null);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
    width: 24,
    color: textColorDisabled,
  },
});

export default SettingsScreen;
