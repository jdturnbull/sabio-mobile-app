import React, { useEffect, useState } from 'react';
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
import { setup } from './stores/user/userSlice';
import { theme } from './utils/theme';

createDatabase();

const AppContainer = styled.View`
  flex: 1;
  background-color: #0f1013;
`;

const App = () => {
  const dispatch = useDispatch();
  const colorScheme = Appearance.getColorScheme();
  const loaded = useSelector((state) => state.user.loaded);

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

  const handleNavStateChange = (state) => {
    if (state) {
      setActiveRouteName(getActiveRouteName(state));
    }
  };

  return (
    <NavigationContainer ref={navigationRef} onStateChange={handleNavStateChange}>
      <ThemeProvider theme={themeData}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default ConnectedApp;
