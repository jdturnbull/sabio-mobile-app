import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getIconFromLabel } from '../../../../../../utils/icon';

const Header = () => {
  const TypeIcon = getIconFromLabel('run');
  const StreakIcon = getIconFromLabel('streak');
  const ConfidenceIcon = getIconFromLabel('confidence');

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
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingBottom: 20,
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
});
