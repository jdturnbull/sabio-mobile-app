import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { getIconFromLabel } from '../../utils/icon';

const TabBar = ({ state, navigation, width }) => {
  const Home = getIconFromLabel('home');
  const Settings = getIconFromLabel('settings');
  const Feed = getIconFromLabel('feed');
  const Analytics = getIconFromLabel('analytics');
  const Chat = getIconFromLabel('chat');

  const activeRoute = state.routes[state.index].name;

  const handlePress = (v) => {
    navigation.navigate(v);
  };

  return (
    <View style={{ height: 80, backgroundColor: '#0f1013', flexDirection: 'row' }}>
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
        <Chat active={activeRoute === 'chat'} />
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
        <Analytics active={activeRoute === 'data'} />
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
        <Settings active={activeRoute === 'settings'} />
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
