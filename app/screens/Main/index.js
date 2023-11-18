import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home';
import Feed from './screens/Feed';
import Chat from './screens/Chat';
import Settings from './screens/Settings';
import { getIconFromLabel } from '../../utils/icon';
import { useNavigation } from '@react-navigation/native';

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

const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const selected = state.index === index;
        const Icon = getIconFromLabel(route.name);

        const handlePress = () => navigation.navigate(route.name);

        return (
          <Pressable onPress={handlePress} style={{ ...styles.tab }} key={route.name}>
            <Icon selected={selected} />
          </Pressable>
        );
      })}
    </View>
  );
};

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      sceneContainerStyle={style}
      screenOptions={options}
      tabBar={(props) => <TabBar {...props} />}>
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
