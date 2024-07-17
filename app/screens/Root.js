import React, { useEffect } from 'react';
import { Easing, View, ActivityIndicator, StyleSheet } from 'react-native';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Onboarding from '../screens/Onboarding';
import Main from '../screens/Main';
import Notifications from './Notifications';
import Account from './Account';
import { useNavigation } from '@react-navigation/native';
import { setup } from '../stores/user/userSlice';

const slideFromRightTransition = {
  animation: 'timing',
  config: {
    duration: 300,
    easing: Easing.linear,
  },
};

const SlideFromRightTransition = {
  transitionSpec: {
    open: slideFromRightTransition,
    close: slideFromRightTransition,
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(setup('Root'));
  }, []);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Onboarding', { screen: 'Welcome' });
      return;
    }
    if (user && user.onboarding_status !== 'COMPLETE') {
      navigation.navigate('Onboarding');
    } else {
      navigation.navigate('Main');
    }
  }, [user]);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, ...CustomTransition }} initialRouteName="Onboarding">
      <RootStack.Screen name="Onboarding" component={Onboarding} />
      <RootStack.Screen name="Main" component={Main} options={{ gestureEnabled: false }} />
      <RootStack.Screen name="Notifications" component={Notifications} options={SlideFromRightTransition} />
      <RootStack.Screen name="Account" component={Account} options={SlideFromRightTransition} />
    </RootStack.Navigator>
  );
};

export default withIAPContext(Root);
