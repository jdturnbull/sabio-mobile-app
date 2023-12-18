import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { getIconFromLabel } from '../../utils/icon';
import { useTheme } from 'styled-components';

const TabBar = ({ state, navigation, width }) => {
  const theme = useTheme();
  const Home = getIconFromLabel('home');
  const Settings = getIconFromLabel('settings');
  const Analytics = getIconFromLabel('analytics');
  const Chat = getIconFromLabel('chat');

  const activeRoute = state.routes[state.index].name;

  const handlePress = (v) => {
    navigation.navigate(v);
  };

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
        shadowOpacity: activeRoute === 'chat' ? 0 : 0.5,
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
