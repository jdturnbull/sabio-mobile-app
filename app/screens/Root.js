import React, { useEffect, useRef, useState } from 'react';
import { Easing, View, Modal, Dimensions, ActivityIndicator, Text } from 'react-native';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Onboarding from '../screens/Onboarding';
import Main from '../screens/Main';
import Notifications from './Notifications';
import Account from './Account';
import PlanOverview from './PlanOverview';
import RearrangeWeek from './RearrangeWeek';
import { useNavigation } from '@react-navigation/native';
import { setup, updateState } from '../stores/user/userSlice';
import useActiveRoute from '../hooks/useActiveRoute';
import NotificationSettings from './NotificationSettings';
import ManagePlan from './Main/ManagePlan';
import Privacy from './Privacy';
import SubscriptionModalContent from '../components/authed/SubscriptionModalContent';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import call from '../utils/call';

const MAIN_SCREENS = ['Slider', 'Account', 'Notifications', 'Reports', 'Feed', 'View'];

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
  const session = useSelector((state) => state.user.session);
  const planIsUpdating = useSelector((state) => state.user.plan_updating);

  const intervalRef = useRef(null);

  const route = useActiveRoute();

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (!user) {
      dispatch(setup('Root'));
    }
  }, [user]);

  useEffect(() => {
    if (planIsUpdating) {
      opacity.value = withTiming(0.8, {
        duration: 300,
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 300,
      });
    }
  }, [planIsUpdating]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        let updatedUser = await call('GET', `users/${user.id}`);

        if (updatedUser?.should_replan) {
          intervalRef.current = setInterval(async () => {
            updatedUser = await call('GET', `users/${user.id}`);
            if (!updatedUser?.should_replan) {
              clearInterval(intervalRef.current);
              dispatch(updateState({ plan_updating: false }));
            }
          }, 5000);
        } else {
          dispatch(updateState({ plan_updating: false }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (planIsUpdating) {
      fetchData();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [planIsUpdating]);


  useEffect(() => {
    if (!user) {
      navigation.navigate('Onboarding', { screen: 'Welcome' });
      return;
    }
    if (user?.onboarding_status === 'COMPLETE' && !MAIN_SCREENS.includes(route)) {
      navigation.navigate('Main', { screen: 'Plan', params: { screen: 'Slider' } });
      return;
    }
    if (user && user.onboarding_status !== 'COMPLETE' && user.onboarding_status !== 'NOT_STARTED') {
      navigation.navigate('Onboarding', { screen: 'CreatingPlan' });
      return;
    }
    if (user && user.onboarding_status !== 'COMPLETE') {
      navigation.navigate('Onboarding');
    }
  }, [user, session, navigation]);

  const showSubscribeModal = useSelector((state) => state.user.showSubscribeModal);

  const handleRequestClose = () => {
    dispatch(updateState({ showSubscribeModal: false }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#16171B' }}>
      <RootStack.Navigator screenOptions={{ headerShown: false, ...CustomTransition }} initialRouteName="Onboarding">
        <RootStack.Screen name="Onboarding" component={Onboarding} />
        <RootStack.Screen name="Main" component={Main} options={{ gestureEnabled: false }} />
        <RootStack.Screen name="Notifications" component={Notifications} options={SlideFromRightTransition} />
        <RootStack.Screen name="Account" component={Account} options={SlideFromRightTransition} />
        <RootStack.Screen name="NotificationSettings" component={NotificationSettings} options={SlideFromRightTransition} />
        <RootStack.Screen name="ManagePlan" component={ManagePlan} options={SlideFromRightTransition} />
        <RootStack.Screen name="Privacy" component={Privacy} options={SlideFromRightTransition} />
        <RootStack.Screen name="PlanOverview" component={PlanOverview} options={SlideFromRightTransition} />
        <RootStack.Screen name="RearrangeWeek" component={RearrangeWeek} options={SlideFromRightTransition} />
      </RootStack.Navigator>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSubscribeModal}
        onRequestClose={handleRequestClose}
      >
        <SubscriptionModalContent />
      </Modal>
      {planIsUpdating && <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }, animatedStyle]}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Sabio is analysing your changes</Text>
        <ActivityIndicator color={'#fff'} />
      </Animated.View>}
    </View>
  );
};

export default withIAPContext(Root);
