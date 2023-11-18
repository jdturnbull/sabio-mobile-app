import React, { useState } from 'react';
import styled from 'styled-components';
import { StatusBar } from 'react-native';
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

createDatabase();

const AppContainer = styled.View`
  flex: 1;
  background-color: #0f1013;
`;

const App = () => {
  const dispatch = useDispatch();

  dispatch(setup());

  return (
    <AppContainer>
      <StatusBar barStyle="light-content" hidden={false} translucent={false} />
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
  const [activeRouteName, setActiveRouteName] = useState();

  const handleNavStateChange = (state) => {
    if (state) {
      setActiveRouteName(getActiveRouteName(state));
    }
  };

  return (
    <NavigationContainer ref={navigationRef} onStateChange={handleNavStateChange}>
      <Provider store={store}>
        <App />
      </Provider>
    </NavigationContainer>
  );
};

export default ConnectedApp;
