import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home';
import Feed from './screens/Feed';
import Chat from './screens/Chat';
import Data from './screens/Data';
import Settings from './screens/Settings';
import Activity from './screens/Activity';
import Action from './screens/Action';
import TabBar from '../../components/TabBar';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const style = {};

const TabScreenOpts = {
  tabBarShowLabel: false,
  headerShown: false,
};

const TabStackScreen = () => {
  const { width } = useWindowDimensions();
  return (
    <Tab.Navigator
      initialRouteName="home"
      sceneContainerStyle={style}
      screenOptions={TabScreenOpts}
      tabBar={(props) => <TabBar {...props} width={width} />}>
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="feed" component={Feed} />
      <Tab.Screen name="chat" component={Chat} />
      <Tab.Screen name="data" component={Data} />
      <Tab.Screen name="settings" component={Settings} />
    </Tab.Navigator>
  );
};

const OverlayStack = createStackNavigator();

const overlayScreenOpts = {
  cardStyle: { backgroundColor: 'transparent' },
  headerShown: false,
};

const OverlayStackScreen = () => {
  return (
    <OverlayStack.Navigator screenOptions={overlayScreenOpts}>
      <OverlayStack.Screen name="activity" component={Activity} />
      <OverlayStack.Screen name="action" component={Action} />
    </OverlayStack.Navigator>
  );
};

const MainStack = createStackNavigator();

const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        keyboardHandlingEnabled: false,
      }}>
      <MainStack.Screen name="TabStack" component={TabStackScreen} />
      <MainStack.Screen name="OverlayStack" component={OverlayStackScreen} />
    </MainStack.Navigator>
  );
};

export default Main;
