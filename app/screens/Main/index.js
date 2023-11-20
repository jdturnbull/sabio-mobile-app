import React from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home';
import Feed from './screens/Feed';
import Chat from './screens/Chat';
import Settings from './screens/Settings';
import { getIconFromLabel } from '../../utils/icon';

const Tab = createBottomTabNavigator();

const style = {
  backgroundColor: '#0f1013',
  borderTopColor: '#0f1013',
  paddingBottom: 10,
  paddingTop: 10,
};

const options = {
  tabBarShowLabel: false,
  headerShown: false,
};

const TabBar = ({ state, descriptors, navigation, width }) => {
  const radius = 50;
  const left = width / 2 - radius;
  const boxWidth = width / 2 - radius;

  const FloatingButton = getIconFromLabel('floatingButton');
  const Home = getIconFromLabel('home');
  const Settings = getIconFromLabel('settings');

  const activeRoute = state.routes[state.index].name;

  const handlePress = (v) => {
    navigation.navigate(v);
  };

  return (
    <View style={{ height: 120, backgroundColor: '#0f1013' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          shadowOffset: {
            width: 3,
            height: 4,
          },
          shadowRadius: 7,
          shadowOpacity: 0.3,
          shadowColor: '#000',
        }}>
        <View
          style={{
            ...styles.container,
            borderTopRightRadius: 100,
            width: boxWidth,
          }}>
          <Pressable
            onPress={() => handlePress('home')}
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <Home active={activeRoute === 'home'} />
          </Pressable>
        </View>
        <View
          style={{
            ...styles.container,
            height: 80,
            marginTop: 10,
            width: radius * 2,
            position: 'absolute',
            left,
            zIndex: 1,
          }}></View>
        <View
          style={{
            ...styles.container,
            borderTopLeftRadius: 100,
            width: boxWidth,
            position: 'absolute',
            left: width - boxWidth,
          }}>
          <Pressable
            onPress={() => handlePress('settings')}
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <Settings active={activeRoute === 'settings'} />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          height: radius * 2 + 20,
          width: radius * 2 + 20,
          borderRadius: radius * 4,
          backgroundColor: '#0f1013',
          bottom: 26,
          left: left - 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            shadowOffset: {
              width: 3,
              height: 4,
            },
            shadowRadius: 7,
            shadowOpacity: 0.3,
            shadowColor: '#E66642',
          }}>
          <Pressable style={{ borderRadius: 40 }} onPress={() => handlePress('chat')}>
            <FloatingButton />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const Main = () => {
  const { width } = useWindowDimensions();
  return (
    <Tab.Navigator
      initialRouteName="home"
      sceneContainerStyle={style}
      screenOptions={options}
      tabBar={(props) => <TabBar {...props} width={width} />}>
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="feed" component={Feed} />
      <Tab.Screen name="chat" component={Chat} />
      <Tab.Screen name="settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#16171B',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
  },
  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
