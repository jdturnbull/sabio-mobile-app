import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Text } from 'react-native';
import moment from 'moment';
import Top from './components/Top';
import { FlatList } from 'react-native-gesture-handler';
import background from '../../../../../../assets/background-chat.png';
import { useSelector } from 'react-redux';
import { hapticImpact } from '../../../../../../utils/haptics';
import { getIconFromLabel } from '../../../../../../utils/icon';

const BOX_WIDTH = 140;
const BOX_HEIGHT = 60;

const COLOR_MAP = {
  0: '#E66642',
  1: '#FFBE3F',
  2: '#8E84FF',
  3: '#FF5271',
  4: '#E66642',
  5: '#FFBE3F',
  6: '#8E84FF',
  7: '#FF5271',
  8: '#E66642',
  9: '#FFBE3F',
  10: '#8E84FF',
  11: '#FF5271',
  12: '#E66642',
};

const Journey = () => {
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const plannedMonths = useSelector((state) => state.user.plannedMonths);
  const [color, setColor] = useState(COLOR_MAP[moment(plannedMonths[0], 'MMMM YYYY').month()]);
  const [activeMonth, setActiveMonth] = useState(plannedMonths[0]?.toUpperCase());

  const { width: screenWidth } = Dimensions.get('window');
  const center = screenWidth / 2 - BOX_WIDTH / 2;

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    const firstItem = viewableItems[0].item;

    const date = moment(firstItem.date, 'YYYY-MM-DD');
    const month = date.format('MMMM YYYY');

    if (activeMonth !== month) {
      setActiveMonth(month.toUpperCase());
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  };

  const handleLayout = useCallback(() => {
    setActiveMonth(plannedMonths[0]?.toUpperCase());
  }, []);

  const renderItem = ({ item }) => {
    const date = moment.utc(item.date, 'YYYY-MM-DD');
    const isEndOfWeek = date.day() === 6;

    const Icon =
      item.type === 'unplanned'
        ? getIconFromLabel('unplanned')
        : getIconFromLabel(item.type) || getIconFromLabel('default');

    const TickIcon = getIconFromLabel('completed');

    const arr = date.format('Do').split('');
    const num = arr.length === 3 ? arr[0] : `${arr[0]}${arr[1]}`;
    const label = arr.length === 3 ? `${arr[1]}${arr[2]}` : `${arr[2]}${arr[3]}`;

    return (
      <View style={{ ...styles.box, left: item.x + center, top: item.y }}>
        <View style={styles.boxBase}>
          <View
            style={{
              ...styles.boxBase,
              backgroundColor: item.completed ? color : '#8AA1B130',
              shadowOffset: {
                width: 3,
                height: 4,
              },
              shadowRadius: 0,
              shadowOpacity: 1,
              shadowColor: item.completed ? `${color}50` : '#8AA1B110',
            }}>
            <View style={styles.boxLeft}>
              <Icon color={item.completed ? null : '#8AA1B190'} />
            </View>
            <View style={styles.boxRight}>
              {item.completed ? (
                <View
                  style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
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
    );
  };

  useEffect(() => {
    if (!activeMonth) return;
    setColor(COLOR_MAP[moment(activeMonth, 'MMMM YYYY').month()]);
    hapticImpact();
  }, [activeMonth]);

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.background}>
      <Top month={activeMonth} color={color} />

      <FlatList
        onLayout={handleLayout}
        data={plannedActivities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </ImageBackground>
  );
};

export default Journey;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  box: {
    position: 'relative',
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
});
