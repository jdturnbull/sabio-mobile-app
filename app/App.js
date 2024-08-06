import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styled, { ThemeProvider } from 'styled-components';
import { REACT_APP_MIXPANEL_API_KEY } from '@env';
import { StatusBar } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Mixpanel } from 'mixpanel-react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Provider, useDispatch } from 'react-redux';
import { ActiveRouteProvider } from './hooks/useActiveRoute';
import store from './stores/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayPortal } from './components/shared/Overlay';
import { createDatabase } from './data/database';
import Root from './screens/Root';
import { theme } from './utils/theme';
import { MixpanelProvider } from './hooks/useMixpanel';
import Splash from './screens/Splash';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#EE6E12' }}
      contentContainerStyle={{ backgroundColor: '#1F2025' }}
      text1Style={{
        color: '#f8f8f8',
        fontSize: 13
      }}
      text2Style={{
        fontSize: 10
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#EE6E12' }}
      contentContainerStyle={{ backgroundColor: '#1F2025' }}
      text1Style={{
        color: '#f8f8f8',
        fontSize: 15
      }}
    />
  ),
};


createDatabase();

PushNotification.configure({
  onRegister: async function (token) {
    await AsyncStorage.setItem('deviceToken', token.token);
  },
  onNotification: function (notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const mixpanel = new Mixpanel(REACT_APP_MIXPANEL_API_KEY, false);
mixpanel.init();

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
  const dispatch = useDispatch();

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

  const handleNavStateChange = (state) => {
    if (state) {
      setActiveRouteName(getActiveRouteName(state));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#16171B' }}>
      <MixpanelProvider>
        <NavigationContainer theme={{ colors: { background: '#16171B' } }} onStateChange={handleNavStateChange}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <ActiveRouteProvider activeRoute={activeRouteName}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <App />
                </GestureHandlerRootView>
              </ActiveRouteProvider>
            </Provider>
          </ThemeProvider>
        </NavigationContainer>
      </MixpanelProvider>
      <Toast config={toastConfig} />
    </View>
  );
};

export default ConnectedApp;
