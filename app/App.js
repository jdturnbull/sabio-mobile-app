import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { REACT_APP_MIXPANEL_API_KEY } from '@env';
import { Appearance, StatusBar, useColorScheme } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { NavigationContainer } from '@react-navigation/native';
import { Mixpanel } from 'mixpanel-react-native';
import { Provider, useDispatch } from 'react-redux';
import store from './stores/store';
import { useSelector } from 'react-redux';
import { navigationRef } from './utils/navigation';
import { UIStateProvider } from './hooks/useUIState';
import { OverlayPortal } from './components/Overlay';
import { createDatabase } from './data/database';
import Root from './screens/Root';
import { setup } from './stores/user/userSlice';
import { theme } from './utils/theme';
import { MixpanelProvider } from './hooks/useMixpanel';
import AsyncStorage from '@react-native-async-storage/async-storage';

createDatabase();

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    AsyncStorage.setItem('deviceToken', token.token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  popInitialNotification: true,
  requestPermissions: true,
});

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(REACT_APP_MIXPANEL_API_KEY, trackAutomaticEvents);

mixpanel.init();

const AppContainer = styled.View`
  flex: 1;
  background-color: #0f1013;
`;

const App = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const loaded = useSelector((state) => state.user.loaded);

  // Add a listener to the colorScheme changing

  useEffect(() => {
    if (!loaded) {
      dispatch(setup());
    }
  }, [loaded]);

  return (
    <AppContainer>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        hidden={false}
        translucent={false}
      />
      <UIStateProvider>
        <Root />
        <OverlayPortal />
      </UIStateProvider>
    </AppContainer>
  );
};

const getActiveRouteName = (state) => {
  const route = state.routes[state?.index || 0];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const ConnectedApp = () => {
  const colorScheme = useColorScheme();
  const [themeData, setThemeData] = useState(theme(colorScheme));
  const [activeRouteName, setActiveRouteName] = useState();

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeData(theme(colorScheme));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleNavStateChange = (state) => {
    if (state) {
      setActiveRouteName(getActiveRouteName(state));
    }
  };

  return (
    <MixpanelProvider>
      <NavigationContainer ref={navigationRef} onStateChange={handleNavStateChange}>
        <ThemeProvider theme={themeData}>
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </NavigationContainer>
    </MixpanelProvider>
  );
};

export default ConnectedApp;
