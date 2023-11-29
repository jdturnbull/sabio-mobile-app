import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import Top from './components/Top';
import { FlatList } from 'react-native-gesture-handler';
import background from '../../../../../../assets/background-chat.png';
import { useSelector } from 'react-redux';

const BOX_WIDTH = 140;
const BOX_HEIGHT = 60;

const Journey = () => {
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const center = screenWidth / 2 - BOX_WIDTH / 2;

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ ...styles.box, left: item.x + center, top: item.y }}>
        <View style={styles.boxLeft}></View>
        <View style={styles.boxRight}></View>
      </View>
    );
  };

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.background}>
      <Top />
      <FlatList
        data={plannedActivities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </ImageBackground>
  );
};

export default Journey;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    backgroundColor: '#000',
  },
  boxLeft: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boxRight: {
    flex: 1,
    backgroundColor: '#000',
  },
});
