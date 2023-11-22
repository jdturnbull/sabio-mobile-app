import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Data = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          Your <Text style={{ color: '#E66642', fontWeight: '600' }}>Progress</Text>
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
        <Text style={{ color: '#ffffff60', fontWeight: '600', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
          No progress reports yet, Sabio will post one at the end of each training week.
        </Text>
      </View>
    </View>
  );
};

export default Data;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 85,
    marginTop: 45,
    backgroundColor: '#0f1013',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowColor: 'black',
  },
  header: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 25,
    marginHorizontal: 10,
    padding: 20,
  },
});
