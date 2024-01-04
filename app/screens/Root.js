import React, { useEffect, useRef } from 'react';
import { Appearance, Easing, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';
import Onboarding from './Onboarding';
import Main from './Main';
import LostConnectionScreen from './LostConnection';
import Splash from './Splash';

const fadeTransition = {
  animation: 'timing',
  config: {
    duration: 300,
    easing: Easing.linear,
  },
};

const CustomTransition = {
  transitionSpec: {
    open: fadeTransition,
    close: fadeTransition,
  },

  cardStyleInterpolator: ({ current }) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },
};

const TopStack = createStackNavigator();
const AppStack = createStackNavigator();
const AuthedStack = createStackNavigator();

const AuthedApp = () => {
  const { isConnected } = useNetInfo();

  return (
    <React.Fragment>
      <AuthedStack.Navigator
        screenOptions={{ headerShown: false, ...CustomTransition, cardStyle: { backgroundColor: 'transparent' } }}>
        <AuthedStack.Screen name="Main" component={Main} />
      </AuthedStack.Navigator>
      {isConnected === false && <LostConnectionScreen />}
    </React.Fragment>
  );
};

const RootApp = () => {
  const _onboarded = useSelector((state) => state.user.session?.user.onboarded);
  const onboarded = useSelector((state) => state.onboarding.onboarded);

  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false, ...CustomTransition, cardStyle: { backgroundColor: 'transparent' } }}>
      {onboarded || _onboarded ? (
        <AppStack.Screen name="Authed" component={AuthedApp} />
      ) : (
        <AuthedStack.Screen name="Onboarding" component={Onboarding} />
      )}
    </AppStack.Navigator>
  );
};

const Root = () => {
  return (
    <TopStack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, ...CustomTransition, cardStyle: { backgroundColor: 'transparent' } }}>
      <TopStack.Screen name="Splash" component={Splash} />
      <TopStack.Screen name="App" component={RootApp} />
    </TopStack.Navigator>
  );
};

export default withIAPContext(Root);
