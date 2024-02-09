import React, { useEffect, useState } from 'react';
import { REACT_APP_POSTHOG_API_KEY } from '@env';
import styled, { ThemeProvider } from 'styled-components';
import { Appearance, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import store from './stores/store';
import { useSelector } from 'react-redux';
import { navigationRef } from './utils/navigation';
import { UIStateProvider } from './hooks/useUIState';
import { OverlayPortal } from './components/Overlay';
import { createDatabase } from './data/database';
import Root from './screens/Root';
import { usePostHog, PostHogProvider } from 'posthog-react-native';
import { setup } from './stores/user/userSlice';
import { theme } from './utils/theme';

createDatabase();

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
    <NavigationContainer ref={navigationRef} onStateChange={handleNavStateChange}>
      <PostHogProvider
        apiKey={REACT_APP_POSTHOG_API_KEY}
        autocapture={true}
        options={{
          host: 'https://eu.posthog.com',
        }}>
        <ThemeProvider theme={themeData}>
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </PostHogProvider>
    </NavigationContainer>
  );
};

export default ConnectedApp;
