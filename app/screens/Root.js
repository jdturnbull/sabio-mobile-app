import React, { useEffect } from 'react';
import { Easing } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Onboarding from '../screens/Onboarding';

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

const RootStack = createStackNavigator();

const Root = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, ...CustomTransition }} initialRouteName="Onboarding">
      <RootStack.Screen name="Onboarding" component={Onboarding} />
    </RootStack.Navigator>
  );
};

export default withIAPContext(Root);
