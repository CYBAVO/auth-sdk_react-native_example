import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Icon,
  Button,
  Spinner,
} from 'native-base';
import { useNavigation } from 'react-navigation-hooks';
import { DeviceSecurity } from '@cybavo/react-native-auth-service';
import {
  colorPrimary,
  colorOnPrimary,
  colorReject,
  colorWarning,
} from '../Constants';

const UI_DELAY = 500;

const SECURITY_CHECKS = [
  { check: DeviceSecurity.isJailBroken, key: 'isJailBroken', fatal: true },
  { check: DeviceSecurity.isHooked, key: 'isHooked', fatal: true },
  { check: DeviceSecurity.isVirtualApp, key: 'isVirtualApp', fatal: true },
  { check: DeviceSecurity.isEmulator, key: 'isEmulator', fatal: true },
  { check: DeviceSecurity.isMockLocationEnabled, key: 'isMockLocationEnabled' },
  { check: DeviceSecurity.isOnExternalStorage, key: 'isOnExternalStorage' },
  {
    check: DeviceSecurity.isDevelopmentSettingsEnabled,
    key: 'isDevelopmentSettingsEnabled',
  },
  { check: DeviceSecurity.isDebuggingEnabled, key: 'isDebuggingEnabled' },
  { check: DeviceSecurity.isAdbEnabled, key: 'isAdbEnabled' },
];

const LABELS = {
  isJailBroken: 'Jail broken not detected',
  isHooked: 'Hook not detected',
  isVirtualApp: 'Virtual environment not detected',
  isEmulator: 'Emulator not detected',
  isMockLocationEnabled: 'Mock location not enabled',
  isOnExternalStorage: 'Apps on external not detected',
  isDevelopmentSettingsEnabled: 'Developer options disabled',
  isDebuggingEnabled: 'Debugger disabled',
  isAdbEnabled: 'ADB disabled',
};

const isDeviceSecure = items => !items.find(item => item.result === 'FATAL');

const iconColor = result =>
  result === 'PASS'
    ? colorOnPrimary
    : result === 'FATAL'
    ? colorReject
    : colorWarning;

const iconName = result =>
  result === 'PASS'
    ? 'check-circle-outline'
    : result === 'FATAL'
    ? 'cancel'
    : 'alert-outline';

const SecurityCheckScreen: () => React$Node = () => {
  const [securityItems, setSecurityItems] = useState(SECURITY_CHECKS);
  const [isSecure, setIsSecure] = useState(null);
  const { navigate } = useNavigation();

  useEffect(() => {
    const secItem = securityItems.find(item => item.result === undefined);
    if (secItem) {
      setTimeout(() => {
        secItem.check().then(detected => {
          setSecurityItems(
            securityItems.map(item => {
              if (item.key === secItem.key) {
                return {
                  ...item,
                  result: !detected ? 'PASS' : item.fatal ? 'FATAL' : 'WARNING',
                };
              } else {
                return item;
              }
            })
          );
        });
      }, UI_DELAY);
    } else {
      // finish
      setIsSecure(isDeviceSecure(securityItems));
    }
  }, [securityItems]);

  useEffect(() => {
    if (isSecure) {
      navigate('Main');
    }
  }, [isSecure, navigate]);

  return (
    <Container style={styles.container}>
      <Header noLeft noShadow />
      <Content contentContainerStyle={styles.contentContainer}>
        <View style={styles.upper}>
          <Icon
            style={styles.figure}
            type="MaterialCommunityIcons"
            name="security"
          />
        </View>
        <View style={styles.body}>
          {securityItems.map(({ key, result }) => (
            <View key={key} style={styles.item}>
              <Text style={styles.label}>{LABELS[key]}</Text>
              <View style={styles.state}>
                {result === undefined && (
                  <Spinner color={colorOnPrimary} size={22} />
                )}
                {result !== undefined && (
                  <Icon
                    type="MaterialCommunityIcons"
                    name={iconName(result)}
                    style={[
                      styles.icon,
                      {
                        color: iconColor(result),
                      },
                    ]}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
        {isSecure === false && (
          <Button
            warning
            full
            style={styles.button}
            onPress={() => navigate('Main')}>
            <Text>Ignore and continue</Text>
          </Button>
        )}
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorPrimary,
  },
  contentContainer: {
    flex: 1,
  },
  upper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  figure: {
    fontSize: 128,
    color: colorOnPrimary,
  },
  body: {
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  label: {
    color: colorOnPrimary,
  },
  state: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  button: {
    marginHorizontal: 16,
  },
});
export default SecurityCheckScreen;
