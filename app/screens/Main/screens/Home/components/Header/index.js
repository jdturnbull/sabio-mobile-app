import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { getIconFromLabel } from '../../../../../../utils/icon';
import { useSelector } from 'react-redux';

const Header = () => {
  const TypeIcon = getIconFromLabel('runsmall');
  const StreakIcon = getIconFromLabel('streak');
  const ConfidenceIcon = getIconFromLabel('confidence');
  const ReadIcon = getIconFromLabel('read');

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.type}>
          <TypeIcon />
        </View>
        <View style={styles.streak}>
          <StreakIcon />
          <Text style={styles.streakText}>2</Text>
        </View>
        <View style={styles.confidence}>
          <ConfidenceIcon />
          <Text style={styles.confidenceText}>80%</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.left}>
          <Text style={styles.bottomHeader}>JANURARY, MONTH 1</Text>
          <Text style={styles.bottomMain}>Building foundations, focusing on routine and consistency</Text>
        </View>
        <Pressable style={styles.pressable}>
          <ReadIcon />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  type: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  streak: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Noto Sans',
    marginLeft: 5,
    color: '#fff',
  },
  confidence: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 16,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#fff',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#E66642',
    paddingLeft: 20,
    paddingRight: 0,
    borderRadius: 15,
    marginTop: 20,
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
