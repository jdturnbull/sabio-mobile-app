import React from 'react';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';

const ContinueButton = ({ disabled, onPress }) => {
  const width = useWindowDimensions().width;

  return (
    <Pressable
      onPress={onPress}
      style={{
        ...styles.container,
        width: width * 0.93,
        borderColor: disabled ? '#ffffff70' : '#fff',
      }}>
      <Text style={{ ...styles.text, color: disabled ? '#ffffff70' : '#fff' }}>Continue</Text>
    </Pressable>
  );
};

export default ContinueButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 80,
    padding: 16,
    margin: 10,
    borderWidth: 1,
    marginBottom: 30,
  },
  text: {
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
});
