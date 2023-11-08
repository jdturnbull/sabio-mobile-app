import React, { useRef } from 'react';
import { StyleSheet, Pressable, Text, useWindowDimensions, Animated } from 'react-native';
import { getIconFromLabel } from '../../../utils/icon';

const AnimatedPressable = ({ onPress, icon, label }) => {
  const Icon = icon ? getIconFromLabel(icon) : null;

  const scaleValue = useRef(new Animated.Value(1)).current;

  const pressInAnimation = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const pressOutAnimation = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => onPress();

  return (
    <Animated.View style={{ ...styles.container, transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={pressInAnimation}
        onPressOut={pressOutAnimation}
        style={({ pressed }) => [
          styles.pressable,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}>
        {Icon && <Icon />}
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedPressable;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  pressable: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#1F2025',
    borderRadius: 8,
    width: '80%',
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 11,
    elevation: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 20,
  },
});
