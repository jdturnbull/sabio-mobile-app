import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { getIconFromLabel } from '../../../../../../../utils/icon';

const Top = ({ viewableItems, setShowPlan }) => {
  const user = useSelector((state) => state.user.session.user);
  const monthlyFocuses = user.monthlyFocuses;
  const plannedMonths = useSelector((state) => state.user.plannedMonths);
  const ReadIcon = getIconFromLabel('read');

  const month = moment(viewableItems[0]?.item.date, 'YYYY-MM-DD').format('MMMM YYYY').toUpperCase();

  const monthIndex = plannedMonths.indexOf(month) + 1;

  const handlePress = () => {
    setShowPlan(true);
  };

  return (
    <Animated.View
      style={{
        ...styles.container,
        backgroundColor: '#E66642',
        shadowColor: '#E66642',
      }}>
      <View style={styles.left}>
        <Text style={styles.bottomHeader}>{`${month}, MONTH ${monthIndex}`}</Text>
        <Text style={styles.bottomMain}>{monthlyFocuses[month]}</Text>
      </View>
      <Pressable onPress={handlePress} style={styles.pressable}>
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
    color: '#F8F8F8',
    fontFamily: 'Noto Sans',
  },
  bottomMain: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff99',
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
