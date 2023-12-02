import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Text, TouchableWithoutFeedback, Pressable } from 'react-native';
import moment from 'moment';
import Top from './components/Top';
import { FlatList } from 'react-native-gesture-handler';
import background from '../../../../../../assets/background-chat.png';
import { useSelector } from 'react-redux';
import { hapticImpact } from '../../../../../../utils/haptics';
import { getIconFromLabel } from '../../../../../../utils/icon';

const BOX_WIDTH = 140;
const BOX_HEIGHT = 60;

const Journey = () => {
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const plannedMonths = useSelector((state) => state.user.plannedMonths);
  const user = useSelector((state) => state.user.session.user);
  const [activeMonth, setActiveMonth] = useState(plannedMonths[0]?.toUpperCase());
  const [startOfWeekDates, setStartOfWeekDates] = useState([]);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const center = screenWidth / 2 - BOX_WIDTH / 2;

  useEffect(() => {
    if (!plannedActivities || plannedActivities.length === 0) return;

    const dates = plannedActivities.map((activity) => activity.date);
    const datesNoDuplicates = [...new Set(dates)];

    setStartOfWeekDates(datesNoDuplicates.filter((date) => moment.utc(date).day() === 0));
  }, [plannedActivities]);

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    const firstItem = viewableItems[0].item;
    const date = moment(firstItem.date, 'YYYY-MM-DD');
    const month = date.format('MMMM YYYY');

    if (activeMonth !== month) {
      setActiveMonth(month.toUpperCase());
      hapticImpact();
    }
  }, []);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const handleLayout = useCallback(() => {
    setActiveMonth(plannedMonths[0]?.toUpperCase());
  }, []);

  const renderItem = ({ item }) => {
    const date = moment.utc(item.date, 'YYYY-MM-DD');

    const Icon =
      item.type === 'unplanned'
        ? getIconFromLabel('unplanned')
        : getIconFromLabel(item.type) || getIconFromLabel('default');

    const TickIcon = getIconFromLabel('completed');

    const arr = date.format('Do').split('');
    const num = arr.length === 3 ? arr[0] : `${arr[0]}${arr[1]}`;
    const label = arr.length === 3 ? `${arr[1]}${arr[2]}` : `${arr[2]}${arr[3]}`;

    return (
      <Pressable style={{ ...styles.pressable, left: item.x + center }}>
        <View style={{ ...styles.box }}>
          <View style={styles.boxBase}>
            <View
              style={{
                ...styles.boxBase,
                backgroundColor: item.completed ? '#E66642' : '#8AA1B130',
                shadowOffset: {
                  width: 3,
                  height: 4,
                },
                shadowRadius: 0,
                shadowOpacity: 1,
                shadowColor: item.completed ? `#E6664250` : '#8AA1B110',
              }}>
              <View style={styles.boxLeft}>
                <Icon color={item.completed ? null : '#8AA1B190'} />
              </View>
              <View style={styles.boxRight}>
                {item.completed ? (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <Text style={{ fontFamily: 'Noto Sans', fontWeight: 700, color: '#fff', fontSize: 16 }}>
                      {num}
                      <Text style={{ fontSize: 12 }}>{label}</Text>
                    </Text>
                    <TickIcon />
                  </View>
                ) : (
                  <Text style={{ fontFamily: 'Noto Sans', fontWeight: 700, color: '#8AA1B190', fontSize: 16 }}>
                    {`${date.format('ddd')} ${num}`}
                    <Text style={{ fontSize: 12 }}>{label}</Text>
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const Separator = ({ item, index }) => {
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

  return (
    <ImageBackground source={background} resizeMode="cover" style={{ flex: 1 }}>
      <Top month={activeMonth} />
      <FlatList
        style={{ marginTop: 4 }}
        contentContainerStyle={{ paddingTop: 35 }}
        onLayout={handleLayout}
        data={plannedActivities}
        renderItem={renderItem}
        windowSize={10}
        ItemSeparatorComponent={(item, index) => <Separator item={item} index={index} />}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </ImageBackground>
  );
};

export default Journey;

const styles = StyleSheet.create({
  pressable: {
    height: BOX_HEIGHT,
    marginBottom: 35,
    width: BOX_WIDTH,
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
  },
  boxBase: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16171B',
    borderRadius: 12,
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowColor: '#16171B',
  },
  boxLeft: {
    flex: 0.35,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    borderColor: '#16171B20',
  },
  boxRight: {
    flex: 0.65,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorContainer: {
    width: '100%',
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
