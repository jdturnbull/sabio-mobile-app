import React, { useEffect, useRef } from 'react';
import { Easing, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';
import Onboarding from './Onboarding';
import Main from './Main';

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

const Splash = () => {
  const { replace } = useNavigation();
  const lottieRef = useRef();

  const { loaded } = useSelector((state) => state.user);
  const { current: loadedDT } = useRef(Date.now());

  useEffect(() => {
    if (!loaded) {
      lottieRef.current.play();
    } else {
      setTimeout(() => replace('App'), Math.max(1100 - Date.now() + loadedDT, 0));
    }
  }, [loaded]);

  return (
    <View style={{ backgroundColor: '#0f1013', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        ref={lottieRef}
        source={require('../assets/lf20_muaaisyt.json')}
        loop={true}
        duration={1300}
        style={{ backgroundColor: '#0f1013', width: '25%', height: '25%' }}
      />
    </View>
  );
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

export default Root;
