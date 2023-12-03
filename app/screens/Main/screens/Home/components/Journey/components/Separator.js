import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';
import { useSelector } from 'react-redux';

const Separator = ({ item, startOfWeekDates }) => {
  const user = useSelector((state) => state.user.session.user);

  let weekNumber = 0;
  const date = moment.utc(item.leadingItem?.date, 'YYYY-MM-DD').format('YYYY-MM-DD');

  if (startOfWeekDates.includes(date)) {
    weekNumber = startOfWeekDates.indexOf(date) + 1;
    const focus = user.weeklyFocuses[`week ${weekNumber}`];

    return (
      <View style={styles.separatorContainer}>
        <View style={styles.separatorTop}>
          <View style={styles.separatorDiv} />
          <Text style={styles.separatorTitle}>{`Week ${weekNumber}`}</Text>
          <View style={styles.separatorDiv} />
        </View>
        <View style={styles.separatorBody}>
          <Text style={styles.separatorBodyText}>{focus || ''}</Text>
        </View>
      </View>
    );
  }
};

export default Separator;

const styles = StyleSheet.create({
  separatorContainer: {
    width: '100%',
    zIndex: -1,
  },
  separatorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  separatorDiv: {
    width: '30%',
    height: 1,
    backgroundColor: '#8AA1B190',
  },
  separatorTitle: {
    color: '#8AA1B190',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Noto Sans',
  },
  separatorBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 35,
  },
  separatorBodyText: {
    color: '#8AA1B170',
    fontWeight: '700',
    fontSize: 12,
    fontFamily: 'Noto Sans',
    textAlign: 'center',
  },
});
