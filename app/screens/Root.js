import React, { useEffect, useRef, useState } from 'react';
import { Easing, View, Modal, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import moment from 'moment-timezone';
import Onboarding from '../screens/Onboarding';
import Main from '../screens/Main';
import Notifications from './Notifications';
import Account from './Account';
import Chat from './Chat';
import PlanOverview from './PlanOverview';
import RearrangeWeek from './RearrangeWeek';
import { useNavigation } from '@react-navigation/native';
import { setup, update, updateState } from '../stores/user/userSlice';
import useActiveRoute from '../hooks/useActiveRoute';
import NotificationSettings from './NotificationSettings';
import ManagePlan from './Main/ManagePlan';
import Privacy from './Privacy';
import SubscriptionModalContent from '../components/authed/SubscriptionModalContent';
import InAppReview from 'react-native-in-app-review';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import call from '../utils/call';
import PlanExpiredModal from '../components/authed/PlanExpiredModal';
import WeeklyCheckinModal from '../components/authed/WeeklyCheckinModal';
import ShowSubscriptionWelcomeModal from '../components/authed/ShowSubscriptionWelcomeModal';
import { usePostHog } from 'posthog-react-native';

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
  const posthog = usePostHog();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const session = useSelector((state) => state.user.session);
  const showNewSubscriptionWelcome = useSelector((state) => state.user?.showNewSubscriptionWelcome);
  const planIsUpdating = useSelector((state) => state.user.plan_updating);

  const [keepWeeklyCheckinClosed, setKeepWeeklyCheckinClosed] = useState(false);

  const training_plans = useSelector((state) => state.user.training_plans) || [];
  const training_plan = training_plans?.filter((p) => p.status === 'ACTIVE')[0] || null;

  const [planExpired, setPlanExpired] = useState(false);
  const [showWeeklyCheckinModal, setShowWeeklyCheckinModal] = useState(false);

  useEffect(() => {
    if (training_plan && moment(training_plan.end_date).isBefore(moment().tz(user.timezone))) {
      setPlanExpired(true);
    }

    if (training_plan && training_plan.next_client_checkin_at < moment().valueOf() && !keepWeeklyCheckinClosed && user?.subscription_status === 'SUBSCRIBED') {
      setShowWeeklyCheckinModal(true);
    }
  }, [training_plan]);

  const intervalRef = useRef(null);

  const route = useActiveRoute();

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const [purchaseUpdateSubscription, setPurchaseUpdateSubscription] = useState(null);
  const [purchaseErrorSubscription, setPurchaseErrorSubscription] = useState(null);

  const initializeConnection = async (setPurchaseUpdateSubscription, setPurchaseErrorSubscription) => {
    try {
      await initConnection();
      const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
        posthog.capture('purchase_updated_listener', { purchase });
        if (purchase.transactionReceipt) {
          try {
            const response = await call('POST', 'users/confirmSubscription', { userId: user.id, purchase });
            if (response === 'EXPIRED') {
              Alert.alert('Subscription expired', 'Please renew your subscription in Apple settings or email support@heysabio.com');
            } else {
              dispatch(update({ userId: user.id, data: { subscription_status: 'SUBSCRIBED' } }));
              dispatch(updateState({ showSubscribeModal: false, showNewSubscriptionWelcome: true }));
              posthog.capture('confirm_subscription_success');
            }
          } catch (error) {
            Alert.alert('There was a problem confirming your subscription', 'Please try again or email support@heysabio.com');
            posthog.capture('confirm_subscription_error', { error });
          }
        }
      });

      setPurchaseUpdateSubscription(purchaseUpdateSubscription);
    } catch (error) {
      posthog.capture('init_iap_connection_error', { error });
    }
  };

  useEffect(() => {
    initializeConnection(setPurchaseUpdateSubscription, setPurchaseErrorSubscription);

    const purchaseErrorSubscription = purchaseErrorListener(
      (error) => {
        console.warn('purchaseErrorListener', error);
        posthog.capture('purchase_error_listener', { error });
      },
    );
    setPurchaseErrorSubscription(purchaseErrorSubscription);

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);



  useEffect(() => {
    if (!user) {
      dispatch(setup('Root'));
    } else {
      posthog.identify(user.id, {
        email: user.email,
        name: `${user.first_name} ${user.second_name}`,
      });

      if (moment.unix(user?.created_at / 1000).isBefore(moment().subtract(1, 'weeks')) && !user?.has_requested_review) {
        setTimeout(() => {
          InAppReview.RequestInAppReview()
            .then((hasFlowFinishedSuccessfully) => {
              if (hasFlowFinishedSuccessfully) {
                dispatch(update({ userId: user.id, data: { has_requested_review: true } }));
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }, 2000);
      }
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
    if (user && user.onboarding_status !== 'COMPLETE') {
      navigation.navigate('Onboarding');
    }
  }, [user, session, navigation]);

  const showSubscribeModal = useSelector((state) => state.user.showSubscribeModal);

  const handleRequestClose = () => {
    dispatch(updateState({ showSubscribeModal: false }));
  };

  const handleExpiredPlanClose = () => {
    setPlanExpired(false);
  }

  const handleWeeklyCheckinClose = () => {
    setShowWeeklyCheckinModal(false);
    setKeepWeeklyCheckinClosed(true);
  }

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
        <RootStack.Screen name="Chat" component={Chat} />
      </RootStack.Navigator>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSubscribeModal}
        onRequestClose={handleRequestClose}
      >
        <SubscriptionModalContent />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={planExpired}
      >
        <PlanExpiredModal handleClose={handleExpiredPlanClose} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWeeklyCheckinModal}
      >
        <WeeklyCheckinModal handleClose={handleWeeklyCheckinClose} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewSubscriptionWelcome}
      >
        <ShowSubscriptionWelcomeModal />
      </Modal>
      {planIsUpdating && <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }, animatedStyle]}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Sabio is analysing your plan</Text>
        <ActivityIndicator color={'#fff'} />
      </Animated.View>}
    </View>
  );
};

export default withIAPContext(Root);
