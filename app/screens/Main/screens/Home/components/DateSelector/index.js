import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Animated, useWindowDimensions, View, StyleSheet } from 'react-native';
import moment from 'moment-timezone';
import DateItem from './DateItem';
import styled from 'styled-components';
import Selector from './Selector';
import { hapticImpact } from '../../../../../../utils/haptics';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../../../../../../stores/user/userSlice';

const PRELOAD_DATES = 7;
const DATE_LIMIT = 1000;

const generateDates = (centerDate) => {
  const dates = [];
  const m = moment.utc(centerDate).subtract(PRELOAD_DATES + 3, 'days');

  for (let i = -PRELOAD_DATES - 3; i < PRELOAD_DATES + 4; i++) {
    dates.push({ date: m.format('YYYY-MM-DD'), index: i });
    m.add(1, 'day');
  }

  return dates;
};

const Container = styled(Animated.View)`
  background-color: #0f1013;
  shadow-offset: 0 4px;
  shadow-radius: 3px;
  shadow-opacity: 0.3;
  shadow-color: black;
`;

const Inner = styled(Animated.View)`
  flex-direction: row;
`;

const Padder = styled(Animated.View)`
  height: 68px;
  margin: 9px 0;
`;

const DateSelector = () => {
  const dispatch = useDispatch();
  const { width: screenWidth } = useWindowDimensions();

  const { timezone: deviceTimezone } = useSelector((state) => state.user.session.user);

  const selectedIdx = useRef(new Animated.Value(0)).current;
  const today = moment.tz(deviceTimezone).format('YYYY-MM-DD');

  const { selectedDate } = useSelector((state) => state.user);

  const initialDates = useMemo(() => generateDates(selectedDate), []);

  const [dates, setDates] = useState(initialDates);

  // CONSTANTS

  const DATE_ITEM_WIDTH = Math.floor(screenWidth / 7);
  const INNER_WIDTH = DATE_ITEM_WIDTH * PRELOAD_DATES * 2 + 7;

  const translateX = new Animated.Value(0);

  const [offsetX, setOffsetX] = useState(-DATE_ITEM_WIDTH * PRELOAD_DATES);

  const handleSelectDate = (date) => {
    console.log('Selected a date');
    const newIdx = dates.find((d) => d.date === date).index;
    const newTranslateX = -DATE_ITEM_WIDTH * newIdx;

    dispatch(setSelectedDate(date));

    Animated.spring(translateX, {
      toValue: newTranslateX,
      stiffness: 150,
      damping: 20,
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    const minIdx = dates[0].index;
    const maxIdx = dates[dates.length - 1].index;

    if (newIdx <= minIdx + 7) {
      // add dates to start
      const newDates = dates.slice(0, -7);
      const m = moment.utc(dates[0].date);

      for (let i = 0; i < 7; i++) {
        m.subtract(1, 'days');
        newDates.unshift({ date: m.format('YYYY-MM-DD'), index: minIdx - i - 1 });
      }

      setDates(newDates);
      setOffsetX(offsetX - 7 * DATE_ITEM_WIDTH);
    } else if (newIdx >= maxIdx - 7) {
      // add dates to end
      const newDates = dates.slice(7);
      const m = moment.utc(dates[dates.length - 1].date);

      for (let i = 0; i < 7; i++) {
        m.add(1, 'days');
        newDates.push({ date: m.format('YYYY-MM-DD'), index: maxIdx + i + 1 });
      }

      setDates(newDates);
      setOffsetX(offsetX + 7 * DATE_ITEM_WIDTH);
    }
  };

  useEffect(() => {
    const listenerId = translateX.addListener(({ value }) => {
      const currentIdx = Math.round(-value / DATE_ITEM_WIDTH);

      if (currentIdx !== selectedIdx._value) {
        hapticImpact();
        // Use `.setValue()` method to update the `Animated.Value`
        selectedIdx.setValue(currentIdx);
      }
    });

    // Remove the listener when the component unmounts
    return () => {
      translateX.removeListener(listenerId);
    };
  }, [translateX]);

  // when scrolling.value is 1 we want it to be full size
  const innerStyle = {
    width: INNER_WIDTH,
    transform: [
      {
        translateX: translateX.interpolate({
          inputRange: [-DATE_LIMIT * DATE_ITEM_WIDTH, 0],
          outputRange: [-DATE_LIMIT * DATE_ITEM_WIDTH, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const padLeft = DATE_LIMIT * DATE_ITEM_WIDTH + offsetX;
  const padRight = DATE_LIMIT * DATE_ITEM_WIDTH - offsetX;

  return (
    <Container>
      <Inner style={innerStyle}>
        <Padder style={{ width: padLeft }} />

        {dates.map(({ date, index }) => (
          <DateItem
            key={date}
            index={index}
            date={date}
            width={DATE_ITEM_WIDTH}
            isToday={today === date}
            isSelected={selectedDate === date}
            onPress={handleSelectDate}
          />
        ))}

        <Padder style={{ width: padRight }} />
      </Inner>

      <Selector width={DATE_ITEM_WIDTH} />
    </Container>
  );
};

export default DateSelector;
