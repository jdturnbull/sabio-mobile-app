import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import Top from './components/Top';
import { ScrollView } from 'react-native-gesture-handler';
import background from '../../../../../../assets/background-chat.png';

const BOX_WIDTH = 140;
const BOX_HEIGHT = 60;

// Init array
let boxes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const Journey = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const center = screenWidth / 2 - BOX_WIDTH / 2;

  let count = 0;
  let previousX = 0;
  let isMinus = true;

  for (let i = 0; i < boxes.length; i++) {
    let x = 0;
    let y = BOX_HEIGHT * i + 24 * (i + 1);

    // Every four boxes we change direction
    if (count === 4 || i === 3) {
      isMinus = !isMinus;
      count = 0;
    }

    // We want to center the first and every fifth box.
    if (i === 0) {
      x = center;
      previousX = x;
    } else {
      x = isMinus ? previousX - 25 : previousX + 25;
      previousX = x;
    }

    count++;

    boxes[i] = { x, y };
  }

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.background}>
      <Top />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, height: screenHeight }}>
        <View style={{ flex: 1 }}>
          {boxes.map((box, i) => {
            return (
              <View
                style={{
                  position: 'absolute',
                  left: box.x,
                  top: box.y,
                  width: BOX_WIDTH,
                  height: BOX_HEIGHT,
                  backgroundColor: '#000',
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Journey;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
