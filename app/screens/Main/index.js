import React, { useEffect } from 'react';
import { Dimensions, View, LayoutAnimation } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import Header from '../../components/authed/Header';
import TabBar from '../../components/authed/TabBar';

import Plan from './Plan';
import Progress from './Progress';
import Community from './Community';
import Profile from './Profile';

const HIDE_HEADER_ROUTES = ['ViewDay', 'EquipmentAndFacilities', 'PastExperience', 'Injuries', 'Medications', 'ChronicIllness', 'Preferences', 'Schedules', 'PlanOverview', 'RearrangeWeek'];

const width = Dimensions.get('window').width;

const TabStack = createBottomTabNavigator();

const getActiveSubRoute = (route) => {
  if (!route.state || !route.state.routes) {
    return null;
  }
  const subRoute = route.state.routes[route.state.index];
  return subRoute.state ? subRoute.state.routes[subRoute.state.index].name : subRoute.name;
};

const Main = () => {
  const navigationState = useNavigationState(state => state);
  const activeRoute = navigationState.routes[navigationState.index];
  const activeTab = activeRoute.state ? activeRoute.state.routes[activeRoute.state.index].name : activeRoute.name;

  const tabSubRoute = getActiveSubRoute(activeRoute);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [tabSubRoute, activeTab]);

  return (
    <View style={{ flex: 1, backgroundColor: '#16171B' }}>
      {!HIDE_HEADER_ROUTES.includes(tabSubRoute) ? <Header /> : <View style={{ height: 50 }} />}
      <TabStack.Navigator
        initialRouteName="Plan"
        screenOptions={{ tabBarShowLabel: false, headerShown: false }}
        tabBar={(props) => <TabBar {...props} width={width} />}>
        <TabStack.Screen name="Plan" component={Plan} />
        <TabStack.Screen name="Progress" component={Progress} />
        <TabStack.Screen name="Community" component={Community} />
        <TabStack.Screen name="Profile" component={Profile} />
      </TabStack.Navigator>
    </View>
  );
};

export default Main;
