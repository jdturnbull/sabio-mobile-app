import React from 'react';
import { Dimensions, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from '../../components/authed/Header';
import TabBar from '../../components/authed/TabBar';

import Plan from './Plan';
import Progress from './Progress';
import Community from './Community';
import Profile from './Profile';

const width = Dimensions.get('window').width;

const TabStack = createBottomTabNavigator();

const Main = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#16171B' }}>
      <Header />
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
