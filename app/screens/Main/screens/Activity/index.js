import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1013',
    borderWidth: 1,
    borderColor: 'red',
  },
});

const Activity = () => {
  return <View style={styles.container}></View>;
};

export default Activity;
