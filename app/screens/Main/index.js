import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home';
import Feed from './screens/Feed';
import Chat from './screens/Chat';
import Data from './screens/Data';
import Settings from './screens/Settings';
import Activity from './screens/Activity';
import TabBar from '../../components/TabBar';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const style = {
  backgroundColor: '#0f1013',
  borderTopColor: '#0f1013',
  paddingBottom: 10,
  paddingTop: 10,
};

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
    </OverlayStack.Navigator>
  );
};

const MainStack = createStackNavigator();

const Main = () => {
  return (
    <MainStack.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        keyboardHandlingEnabled: false,
      }}>
      <MainStack.Screen name="TabStack" component={TabStackScreen} />
      <MainStack.Screen
        name="OverlayStack"
        component={OverlayStackScreen}
        options={{
          cardStyle: {
            marginTop: 100,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          },
        }}
      />
    </MainStack.Navigator>
  );
};

export default Main;
