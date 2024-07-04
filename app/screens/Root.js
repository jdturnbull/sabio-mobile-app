import React, { useEffect } from 'react';
import { Easing, View, ActivityIndicator, StyleSheet } from 'react-native';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import Onboarding from '../screens/Onboarding';
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

const RootStack = createStackNavigator();

const Root = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user && user.onboarding_status !== 'COMPLETE') {
      navigation.navigate('Onboarding');
    }
  }, [user]);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, ...CustomTransition }} initialRouteName="Onboarding">
      <RootStack.Screen name="Onboarding" component={Onboarding} />
    </RootStack.Navigator>
  );
};

export default withIAPContext(Root);
