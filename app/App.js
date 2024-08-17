import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import styled, { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { PostHogProvider } from 'posthog-react-native'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_POSTHOG_API_KEY } from '@env';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ActiveRouteProvider } from './hooks/useActiveRoute';
import store from './stores/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayPortal } from './components/shared/Overlay';
import { createDatabase } from './data/database';
import Root from './screens/Root';
import { theme } from './utils/theme';
import Splash from './screens/Splash';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import call from './utils/call';

createDatabase();

const AppContainer = styled.View`
  flex: 1;
  background-color: #16171b;
`;

const getActiveRouteName = (state) => {
  const route = state.routes[state?.index || 0];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const App = () => {
  return (
    <AppContainer>
      <StatusBar barStyle={'light-content'} hidden={false} translucent={false} />
      <Root />
      <OverlayPortal />
    </AppContainer>
  );
};

const ConnectedApp = () => {
  const [activeRouteName, setActiveRouteName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const opacity = useSharedValue(0);

  const handleNavStateChange = (state) => {
    if (state) {
      setActiveRouteName(getActiveRouteName(state));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 1000 });
      }, 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: opacity.value,
    };
  });

  if (isLoading) {
    return <Splash />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#16171B' }}>
      {isLoading ? <Splash /> : (
        <Animated.View style={[{ flex: 1, backgroundColor: '#16171B' }, animatedStyle]}>
          <NavigationContainer theme={{ colors: { background: '#16171B' } }} onStateChange={handleNavStateChange}>
            <PostHogProvider apiKey={REACT_APP_POSTHOG_API_KEY} options={{ host: 'https://eu.i.posthog.com', customStorage: AsyncStorage }}>
              <ThemeProvider theme={theme}>
                <Provider store={store}>
                  <ActiveRouteProvider activeRoute={activeRouteName}>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <App />
                    </GestureHandlerRootView>
                  </ActiveRouteProvider>
                </Provider>
              </ThemeProvider>
            </PostHogProvider>
          </NavigationContainer>
        </Animated.View>
      )}
    </View >
  );
};

export default ConnectedApp;