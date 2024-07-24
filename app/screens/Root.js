import React, { useEffect } from 'react';
import { Easing, View, Modal, Dimensions } from 'react-native';
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
import NotificationSettings from './Main/NotificationSettings';
import ManagePlan from './Main/ManagePlan';
import Privacy from './Privacy';
import SubscriptionModalContent from '../components/authed/SubscriptionModalContent';

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

  const route = useActiveRoute();

  useEffect(() => {
    if (!user) {
      dispatch(setup('Root'));
    }
  }, [user]);


  useEffect(() => {
    if (!user) {
      navigation.navigate('Onboarding', { screen: 'Welcome' });
      return;
    }
    if (user?.onboarding_status === 'COMPLETE' && !MAIN_SCREENS.includes(route)) {
      navigation.navigate('Main', { screen: 'Plan', params: { screen: 'Slider' } });
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
    </View>

  );
};

export default withIAPContext(Root);
