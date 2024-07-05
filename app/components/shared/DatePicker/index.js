import React, { useState, useMemo, useRef } from 'react';
import moment from 'moment-timezone';
import { FlatList, Dimensions } from 'react-native';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DaysOfWeek from './DaysOfWeek';
import { calculateDates } from './utils';
import { getDeviceTimezone } from '../../../utils/timezones';

const { width: screenWidth } = Dimensions.get('screen');
const calendarWidth = screenWidth - 40;

const isSameMonthAndYear = (d1, d2) =>
  moment(d1).month() === moment(d2).month() && moment(d1).year() === moment(d2).year();

const isSameMonth = (d1, d2) => moment(d1).month() === moment(d2).month();

const MainContainer = styled.View`
  background-color: #0f1013;
  shadow-offset: 0 4px;
  shadow-radius: 3px;
  shadow-opacity: 0.3;
  shadow-color: black;
`;

const Container = styled.View`
  margin: 12px 20px 8px 20px;
  height: 100%;
`;

const DatesContainer = styled.View`
  width: 100%;
`;

const MonthContainer = styled.View`
  width: ${`${calendarWidth}px`};
`;
const RowContainer = styled.View`
  height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
const DateContainer = styled(TouchableOpacity)`
  height: 100%;
  align-items: center;
  justify-content: center;
`;
const DateInner = styled.View`
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${(props) => (props.visible && props.selected ? '#A9BAFF' : 'transparent')};
`;
const DateText = styled.Text`
  font-size: 14px;
  font-weight: ${(props) => (props.selected ? 600 : props.today ? 700 : 400)};
  color: ${(props) =>
    !props.visible
      ? 'rgba(255, 255, 255, 0.2)'
      : props.selected
      ? 'rgba(0, 0, 0, 0.7)'
      : props.today
      ? 'white'
      : 'rgba(255, 255, 255, 0.8)'};
`;

const Date = ({ dt, selected, visible, onPress, today }) => {
  const handlePress = () => onPress(dt);

  return (
    <DateContainer containerStyle={{ flex: 1 }} onPress={handlePress} disabled={selected || !visible}>
      <DateInner {...{ selected, visible }}>
        <DateText {...{ selected, visible, today }}>{moment(dt).format('D')}</DateText>
      </DateInner>
    </DateContainer>
  );
};

const Month = ({ month, selected, onDatePress, today }) => {
  const dates = calculateDates(month);

  return (
    <MonthContainer>
      {dates.length >= 6 && (
        <RowContainer>
          {dates.slice(0, 7).map((dt) => (
            <Date
              key={dt}
              dt={dt}
              selected={dt === selected}
              today={dt === today}
              visible={isSameMonth(dt, month)}
              onPress={onDatePress}
            />
          ))}
        </RowContainer>
      )}
      {dates.length >= 13 && (
        <RowContainer>
          {dates.slice(7, 14).map((dt) => (
            <Date
              key={dt}
              dt={dt}
              selected={dt === selected}
              today={dt === today}
              visible={isSameMonth(dt, month)}
              onPress={onDatePress}
            />
          ))}
        </RowContainer>
      )}
      {dates.length >= 20 && (
        <RowContainer>
          {dates.slice(14, 21).map((dt) => (
            <Date
              key={dt}
              dt={dt}
              selected={dt === selected}
              today={dt === today}
              visible={isSameMonth(dt, month)}
              onPress={onDatePress}
            />
          ))}
        </RowContainer>
      )}
      {dates.length >= 27 && (
        <RowContainer>
          {dates.slice(21, 28).map((dt) => (
            <Date
              key={dt}
              dt={dt}
              selected={dt === selected}
              today={dt === today}
              visible={isSameMonth(dt, month)}
              onPress={onDatePress}
            />
          ))}
        </RowContainer>
      )}
      {dates.length >= 34 && (
        <RowContainer>
          {dates.slice(28, 35).map((dt) => (
            <Date
              key={dt}
              dt={dt}
              selected={dt === selected}
              today={dt === today}
              visible={isSameMonth(dt, month)}
              onPress={onDatePress}
            />
          ))}
        </RowContainer>
      )}
      {dates.length >= 41 && (
        <RowContainer>
          {dates.slice(35, 42).map((dt) => (
            <Date
              key={dt}
              dt={dt}
              selected={dt === selected}
              today={dt === today}
              visible={isSameMonth(dt, month)}
              onPress={onDatePress}
            />
          ))}
        </RowContainer>
      )}
    </MonthContainer>
  );
};

const DatePicker = ({ date, onSelect, onClose, onAutoSelect, months, setMonths, index, setIndex }) => {
  const [firstScroll, setFirstScroll] = useState(true);
  const [initialDate, setInitialDate] = useState();

  const [original, setOriginal] = useState(date);

  const timezone = getDeviceTimezone();

  const today = moment.tz(timezone).format('YYYY-MM-DD');

  const scrollRef = useRef();

  const handleDatePress = (d) => {
    setOriginal(d);
    onSelect(d);
    onClose();
  };

  const onChange = (d) => {
    if (isSameMonthAndYear(d, initialDate)) {
      setOriginal(initialDate);
      onAutoSelect(initialDate);
    } else {
      setOriginal(d);
      onAutoSelect(d);
    }
  };

  const handleScroll = (e) => {
    if (firstScroll) {
      setInitialDate(date);
      setFirstScroll(false);
    }
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / 374);

    if (index === newIndex) {
      return;
    }

    setIndex(newIndex);
    const newMonth = months[newIndex];

    if (isSameMonth(original, newMonth)) {
      onChange(original);
    } else {
      onChange(newMonth);
    }

    if (newIndex === months.length - 1) {
      const nextMonth = moment.utc(months[newIndex]).add(1, 'month').format('YYYY-MM-DD');

      setMonths([...months, nextMonth]);
    }
  };

  const keyExtractor = (item) => item;

  const renderMonth = ({ item }) => {
    return <Month month={item} selected={date} today={today} onDatePress={handleDatePress} />;
  };

  return (
    <MainContainer>
      <Container>
        <DaysOfWeek />
        <DatesContainer>
          <FlatList
            ref={scrollRef}
            horizontal
            bounces={false}
            initialScrollIndex={index}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, idx) => ({ length: calendarWidth, offset: calendarWidth * idx, index: idx })}
            onScroll={handleScroll}
            scrollEventThrottle={640}
            data={months}
            keyExtractor={keyExtractor}
            renderItem={renderMonth}
            snapToInterval={calendarWidth}
            decelerationRate="fast"
          />
        </DatesContainer>
      </Container>
    </MainContainer>
  );
};

export default DatePicker;
