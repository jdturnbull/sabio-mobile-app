import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import DateItem from './DateItem';
import Selector from './Selector';
import { hapticImpact } from '../../../../../../utils/haptics';
import { useSelector } from 'react-redux';
import useUIState from '../../../../../../hooks/useUIState';

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

const Container = styled.View`
  margin-top: 45px;
  background-color: #0f1013;
  shadow-offset: 0 4px;
  shadow-radius: 3px;
  shadow-opacity: 0.3;
  shadow-color: black;
`;

const Inner = styled(Animated.View)`
  flex-direction: row;
`;

const Padder = styled.View`
  height: 68px;
  margin: 9px 0;
`;

const DateSelector = () => {
  const { width: screenWidth } = useWindowDimensions();

  const { timezone: deviceTimezone } = useSelector((state) => state.user);
  const today = moment.tz(deviceTimezone).format('YYYY-MM-DD');

  const { selectedDate, setSelectedDate } = useUIState();

  const initialDates = useMemo(() => generateDates(selectedDate), []);
  const [dates, setDates] = useState(initialDates);

  // CONSTANTS
  const DATE_ITEM_WIDTH = Math.floor(screenWidth / 7);
  const INNER_WIDTH = DATE_ITEM_WIDTH * PRELOAD_DATES * 2 + 7;

  const translateX = useSharedValue(0);
  const selectedIdx = useSharedValue(0);

  const [offsetX, setOffsetX] = useState(-DATE_ITEM_WIDTH * PRELOAD_DATES);

  const handleSelectDate = (date) => {
    const newIdx = dates.find((d) => d.date === date).index;
    const newTranslateX = -DATE_ITEM_WIDTH * newIdx;

    setSelectedDate(date);

    translateX.value = withSpring(newTranslateX, {
      stiffness: 150,
      damping: 20,
    });

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

  useAnimatedReaction(
    () => translateX.value,
    (result, previous) => {
      const p = selectedIdx.value + previous / DATE_ITEM_WIDTH;
      const c = selectedIdx.value + result / DATE_ITEM_WIDTH;

      if ((c >= 0.9 && p < 0.9) || (c <= -0.9 && p > -0.9)) {
        selectedIdx.value = Math.round(-result / DATE_ITEM_WIDTH);
        runOnJS(hapticImpact)();
      }
    },
    [],
  );

  // when scrolling.value is 1 we want it to be full size
  const innerStyle = useAnimatedStyle(() => {
    return {
      width: INNER_WIDTH,
      transform: [{ translateX: translateX.value - DATE_LIMIT * DATE_ITEM_WIDTH }],
    };
  }, []);

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
