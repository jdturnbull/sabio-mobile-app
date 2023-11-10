import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Main = () => {
  return (
    <View style={styles.container}>
      <Text>Main Screen</Text>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1013',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
