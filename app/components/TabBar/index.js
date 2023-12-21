import React from 'react';
import { View, Pressable, useColorScheme } from 'react-native';
import { getIconFromLabel } from '../../utils/icon';
import { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';

const TabBar = ({ state, navigation, width }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const Home = getIconFromLabel('home');
  const Settings = getIconFromLabel('settings');
  const Analytics = getIconFromLabel('analytics');
  const Chat = getIconFromLabel('chat');

  const activeRoute = state.routes[state.index].name;
  const plannedActivities = useSelector((state) => state.user?.plannedActivities);

  const handlePress = (v) => {
    navigation.navigate(v);
  };

  if (!plannedActivities || plannedActivities?.length === 0) {
    return <View />;
  }

  return (
    <View
      style={{
        height: 80,
        backgroundColor: theme.tabBar.backgroundColor,
        flexDirection: 'row',
        shadowColor: theme.tabBar.shadowColor,
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: activeRoute === 'chat' ? 0 : colorScheme === 'light' ? 0.5 : 0.1,
        shadowSpread: 0,
        shadowRadius: 30,
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
        <Home color={activeRoute === 'home' ? theme.tabBar.iconSelectedColor : theme.tabBar.iconColor} />
      </Pressable>
      <Pressable
        onPress={() => handlePress('chat')}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        <Chat color={activeRoute === 'chat' ? theme.tabBar.iconSelectedColor : theme.tabBar.iconColor} />
      </Pressable>

      <Pressable
        onPress={() => handlePress('data')}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        <Analytics color={activeRoute === 'data' ? theme.tabBar.iconSelectedColor : theme.tabBar.iconColor} />
      </Pressable>
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
        <Settings color={activeRoute === 'settings' ? theme.tabBar.iconSelectedColor : theme.tabBar.iconColor} />
      </Pressable>
    </View>
  );
};

export default TabBar;
