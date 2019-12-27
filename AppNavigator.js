import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon } from 'native-base';
import ActionsScreen from './screens/ActionsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { colorPrimary, textColorDisabled } from './Constants';
import ManagePairingScreen from './screens/ManagePairingScreen';
import NewPairingScreen from './screens/NewPairingScreen';
import ScanScreen from './screens/ScanScreen';
import FinishPairingScreen from './screens/FinishPairingScreen';
import OTPActionScreen from './screens/OTPActionScreen';
import PINCodeActionScreen from './screens/PINCodeActionScreen';
import CompletedActionScreen from './screens/CompletedActionScreen';
import SecurityCheckScreen from './screens/SecurityCheckScreen';

const tabIcons = {
  Actions: 'security',
  Settings: 'settings',
};

const MainTab = createBottomTabNavigator(
  {
    Actions: ActionsScreen,
    Settings: SettingsScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => (
        <Icon
          size={24}
          type="MaterialCommunityIcons"
          name={tabIcons[navigation.state.routeName]}
          style={{ color: tintColor }}
        />
      ),
    }),
    tabBarOptions: {
      activeTintColor: colorPrimary,
      inactiveTintColor: textColorDisabled,
    },
  }
);

const NewPairingStack = createStackNavigator(
  {
    NewPairing: NewPairingScreen,
    Scan: ScanScreen,
    Finish: FinishPairingScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  }
);

const MainStack = createStackNavigator(
  {
    Main: MainTab,
    NewPairing: NewPairingStack,
    ManagePairing: ManagePairingScreen,
    OTPAction: OTPActionScreen,
    PINCodeAction: PINCodeActionScreen,
    CompletedAction: CompletedActionScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      SecurityCheck: SecurityCheckScreen,
      Main: MainStack,
    },
    {
      initialRouteName: 'SecurityCheck',
    }
  )
);
