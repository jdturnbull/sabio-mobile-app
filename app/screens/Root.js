import React, { useEffect } from 'react';
import { Easing, useWindowDimensions } from 'react-native';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNetInfo } from '@react-native-community/netinfo';
import HomeScreen from './Main/Home';
import Chat from './Main/Chat';
import Data from './Main/Data';
import Settings from './Main/Settings';

import Landing from './Onboarding/Landing';
import OptionScreen from './Onboarding/OptionScreen';
import Payment from './Onboarding/Payment';
import Finalise from './Onboarding/Finalise';
import OnboardingChat from './Onboarding/Chat';

import TabBar from '../components/TabBar';
import LostConnectionScreen from './LostConnection';
import Splash from './Splash';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

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
const OnboardingStack = createStackNavigator();
const AuthedStack = createBottomTabNavigator();
const AppStack = createStackNavigator();

const OnboardingApp = () => {
  const navigation = useNavigation();
  const hasOnboardingData = useSelector((state) => state.user.session?.user?.onboardingData);
  const signedIn = useSelector((state) => state.user.signedIn);
  const subscribed = useSelector((state) => state.user.session?.user?.subscriptionStatus === 'SUBSCRIBED');

  useEffect(() => {
    if (signedIn && !subscribed && !hasOnboardingData) {
      navigation.navigate('Option');
    }

    if (signedIn && hasOnboardingData && !subscribed) {
      if (hasOnboardingData.restDays) {
        navigation.navigate('Payment');
      } else {
        navigation.navigate('Finalise');
      }
    }

    if (!signedIn) {
      navigation.navigate('Landing');
    }
  }, [signedIn, subscribed, hasOnboardingData]);

  return (
    <OnboardingStack.Navigator
      initialRouteName={'Landing'}
      screenOptions={{ headerShown: false, ...CustomTransition, cardStyle: { backgroundColor: 'transparent' } }}>
      <OnboardingStack.Screen name="Landing" component={Landing} />
      <OnboardingStack.Screen name="Option" component={OptionScreen} />
      <OnboardingStack.Screen name="Payment" component={Payment} />
      <OnboardingStack.Screen name="Chat" component={OnboardingChat} />
      <OnboardingStack.Screen name="Finalise" component={Finalise} />
    </OnboardingStack.Navigator>
  );
};

const AuthedApp = () => {
  const { isConnected } = useNetInfo();
  const { width } = useWindowDimensions();

  return (
    <React.Fragment>
      <AuthedStack.Navigator
        initialRouteName="home"
        sceneContainerStyle={{}}
        screenOptions={{ tabBarShowLabel: false, headerShown: false }}
        tabBar={(props) => <TabBar {...props} width={width} />}>
        <AuthedStack.Screen name="home" component={HomeScreen} />
        <AuthedStack.Screen name="chat" component={Chat} />
        <AuthedStack.Screen name="data" component={Data} />
        <AuthedStack.Screen name="settings" component={Settings} />
      </AuthedStack.Navigator>
      {isConnected === false && <LostConnectionScreen />}
    </React.Fragment>
  );
};

const RootApp = () => {
  const navigation = useNavigation();
  const subscriptionStatus = useSelector((state) => state.user.session?.user?.subscriptionStatus);
  const onboarded = useSelector((state) => state.user.session?.user?.onboarded);

  // Listen for changes to authed state
  useEffect(() => {
    if (subscriptionStatus === 'SUBSCRIBED') {
      navigation.navigate('Authed');
    } else {
      navigation.navigate('Onboarding');
    }
  }, [onboarded, subscriptionStatus]);

  return (
    <AppStack.Navigator
      initialRouteName={onboarded ? 'Authed' : 'Onboarding'}
      screenOptions={{ headerShown: false, ...CustomTransition, cardStyle: { backgroundColor: 'transparent' } }}>
      <AppStack.Screen name="Authed" component={AuthedApp} />
      <AppStack.Screen name="Onboarding" component={OnboardingApp} />
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
