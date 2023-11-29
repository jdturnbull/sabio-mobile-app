import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { getIconFromLabel } from '../../../../../../../utils/icon';

const Top = () => {
  const ReadIcon = getIconFromLabel('read');

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.bottomHeader}>JANURARY, MONTH 1</Text>
        <Text style={styles.bottomMain}>Building foundations, focusing on routine and consistency</Text>
      </View>
      <Pressable style={styles.pressable}>
        <ReadIcon />
      </Pressable>
    </View>
  );
};

export default Top;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#E66642',
    paddingLeft: 20,
    paddingRight: 0,
    borderRadius: 15,
    marginHorizontal: 10,
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowRadius: 0,
    shadowOpacity: 0.8,
    shadowColor: '#E66642',
  },
  bottomHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8F8F870',
    fontFamily: 'Noto Sans',
  },
  bottomMain: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff95',
    fontFamily: 'Noto Sans',
  },
  left: {
    flex: 1,
    paddingVertical: 20,
  },
  pressable: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderLeftWidth: 2,
    borderColor: '#16171B20',
  },
});
