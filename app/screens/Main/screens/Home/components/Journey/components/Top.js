import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { getIconFromLabel } from '../../../../../../../utils/icon';

const Top = ({ month, color }) => {
  const plannedMonths = useSelector((state) => state.user.plannedMonths);
  const ReadIcon = getIconFromLabel('read');
  const monthIndex = plannedMonths.indexOf(month) + 1;

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [month, scale]);

  return (
    <Animated.View
      style={{
        ...styles.container,
        backgroundColor: color,
        shadowColor: color,
        transform: [{ scale }], // Apply the animated scale here
      }}>
      <View style={styles.left}>
        <Text style={styles.bottomHeader}>{`${month}, MONTH ${monthIndex}`}</Text>
        <Text style={styles.bottomMain}>Building foundations, focusing on routine and consistency</Text>
      </View>
      <Pressable style={styles.pressable}>
        <ReadIcon />
      </Pressable>
    </Animated.View>
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
    color: '#F8F8F890',
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
