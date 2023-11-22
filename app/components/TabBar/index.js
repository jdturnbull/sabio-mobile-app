import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { getIconFromLabel } from '../../utils/icon';

const TabBar = ({ state, navigation, width }) => {
  const radius = 30;
  const left = width / 2 - radius;
  const boxWidth = width / 2 - radius;

  const FloatingButton = getIconFromLabel('floatingButton');
  const Home = getIconFromLabel('home');
  const Settings = getIconFromLabel('settings');
  const Feed = getIconFromLabel('feed');
  const Analytics = getIconFromLabel('analytics');

  const activeRoute = state.routes[state.index].name;

  const handlePress = (v) => {
    navigation.navigate(v);
  };

  return (
    <View style={{ height: 80, backgroundColor: '#0f1013' }}>
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
            paddingHorizontal: 10,
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
          <Pressable
            onPress={() => handlePress('feed')}
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <Feed active={activeRoute === 'feed'} />
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
          }}
        />
        <View
          style={{
            ...styles.container,
            borderTopLeftRadius: 100,
            width: boxWidth,
            position: 'absolute',
            left: width - boxWidth,
            paddingHorizontal: 10,
          }}>
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
      </View>
      <View
        style={{
          height: radius * 2,
          width: radius * 2,
          borderRadius: radius * 4,
          backgroundColor: '#0f1013',
          bottom: 20,
          left,
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
