import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from '../../assets/icons/24x/Calendar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import moment from 'moment';
import ArrowRight from '../../assets/icons/18x/ArrowRight';
import ArrowLeft from '../../assets/icons/18x/ArrowLeft';
import { Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, Keyboard } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const calculateDates = (months) => {
  let dates = [];

  for (let i = 0; i < months.length; i++) {
    const month = months[i];

    const daysInMonth = month.daysInMonth();
    const _dates = Array.from({ length: daysInMonth }, (_, i) => month.date(i + 1).format('YYYY-MM-DD'));

    const days = _dates.slice(0, 8).map((d) => moment(d, 'YYYY-MM-DD').format('ddd'));

    dates.push({ month, dates: _dates, days });
  }

  return dates;
};

const Touchable = Animated.createAnimatedComponent(TouchableWithoutFeedback);

const Container = styled(Animated.View)`
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  border: ${(props) => `1px solid ${props.theme.colors.borderHighlight}`};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Label = styled.Text`
  color: #f8f8f850;
  font-size: ${(props) => props.theme.text.size.xs};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  margin-bottom: 4px;
`;

const StyledValue = styled.Text`
  flex: 1;
  font-family: ${(props) => props.theme.text.family};
  color: ${(props) => props.theme.text.colors.white};
  font-size: ${(props) => props.theme.text.size.md};
`;

const ValueContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SelectorContainer = styled.View`
  flex: 1;
  margin-top: 20px;
  overflow: hidden;
`;

const MonthYearContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MonthYearText = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.text.colors.white};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  font-family: ${(props) => props.theme.text.family};
  margin-left: 1px;
`;

const MonthYearButtonsContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DatesContainer = styled(ScrollView)`
  flex: 1;
  flex-direction: row;
  margin-top: 20px;
`;

const MonthContainer = styled.View`
  flex: 1;
  width: ${() => `${screenWidth}px`};
  zindex: 1000px;
`;

const MonthInner = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${() => `${screenWidth - 70}px`};
`;

const DateTouchable = styled.TouchableOpacity`
  margin: 5px;
  padding: 4px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const DayLabelContainer = styled.View`
  flex-direction: row;
  width: ${() => `${screenWidth - 70}px`};
  margin-bottom: 10px;
`;

const DayLabel = ({ day }) => {
  return <Text style={{ width: 40, textAlign: 'center', color: '#f8f8f850' }}>{day}</Text>;
};

const DateItem = ({ date, onPress, selected }) => {
  const dateString = moment(date, 'YYYY-MM-DD').format('DD');
  return (
    <DateTouchable onPress={() => onPress(date)} style={{ backgroundColor: selected ? '#EE6E12' : '#A1AAD310' }}>
      <Text style={{ color: selected ? '#f8f8f8' : '#f8f8f8' }}>{dateString}</Text>
    </DateTouchable>
  );
};

const DateInput = ({ placeholder, value, setValue, label, alwaysOpen }) => {
  const scrollRef = useRef();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => {
    const initialMonth = moment(value, 'YYYY-MM-DD').startOf('month');
    return moment().startOf('month').diff(initialMonth, 'months');
  });

  const months = useMemo(() => {
    const now = moment();
    return Array.from({ length: 12 }, (_, i) => now.clone().add(i, 'months'));
  }, []);

  const dates = useMemo(() => calculateDates(months), [months]);

  const height = useSharedValue(alwaysOpen ? 320 : 70);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value, { duration: 300 }),
  }));

  const handlePress = () => {
    if (!alwaysOpen) {
      Keyboard.dismiss();
      height.value = height.value === 70 ? 320 : 70;
    }
  };

  const handleAddMonth = useCallback(() => {
    setCurrentMonthIndex((prevIndex) => Math.min(prevIndex + 1, 11)); // Limit to 11 months (0-11 index)
  }, []);

  const handleSubtractMonth = useCallback(() => {
    setCurrentMonthIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  useEffect(() => {
    const newMonth = moment().startOf('month').add(currentMonthIndex, 'months').format('YYYY-MM-DD');
    setValue((prevValue) => moment(prevValue).month(moment(newMonth).month()).format('YYYY-MM-DD'));
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: currentMonthIndex * screenWidth, animated: false });
    }
  }, [currentMonthIndex, setValue]);

  const handleDatePress = (date) => {
    setValue(date);
  };

  const handleMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    setCurrentMonthIndex(newIndex);
  };

  // TODO: The main touchable gets triggered unless you swipe a date item
  return (
    <Touchable onPress={handlePress}>
      <Container style={animatedStyle}>
        {label && <Label>{label.toUpperCase()}</Label>}
        <ValueContainer>
          <StyledValue>{value || placeholder}</StyledValue>
          <Calendar />
        </ValueContainer>
        <SelectorContainer alwaysOpen={alwaysOpen}>
          <MonthYearContainer>
            <MonthYearText>{moment(value, 'YYYY-MM-DD').format('MMMM YYYY')}</MonthYearText>
            <MonthYearButtonsContainer>
              <TouchableOpacity onPress={handleSubtractMonth} style={{ marginRight: 5, padding: 5 }}>
                <ArrowLeft />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddMonth} style={{ marginLeft: 5, padding: 5 }}>
                <ArrowRight />
              </TouchableOpacity>
            </MonthYearButtonsContainer>
          </MonthYearContainer>
          <DatesContainer
            ref={scrollRef}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth}
            decelerationRate="fast">
            {months.map((month, monthIndex) => {
              const data = dates.find((d) => d.month.isSame(month, 'month'));

              return (
                <MonthContainer key={month.format('YYYY-MM')}>
                  <DayLabelContainer>
                    {data.days.map((day, i) => (
                      <DayLabel day={day} key={i} />
                    ))}
                  </DayLabelContainer>
                  <MonthInner>
                    {data.dates.map((date, i) => (
                      <DateItem key={i} date={date} onPress={handleDatePress} selected={date === value} />
                    ))}
                  </MonthInner>
                </MonthContainer>
              );
            })}
          </DatesContainer>
        </SelectorContainer>
      </Container>
    </Touchable>
  );
};

export default DateInput;
