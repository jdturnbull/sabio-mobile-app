import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Calendar from '../../assets/icons/24x/Calendar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import moment from 'moment';
import ArrowRight from '../../assets/icons/18x/ArrowRight';
import ArrowLeft from '../../assets/icons/18x/ArrowLeft';
import { Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const calculateDates = (value) => {
  const daysInMonth = moment(value, 'YYYY-MM-DD').daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) =>
    moment(value, 'YYYY-MM-DD')
      .date(i + 1)
      .format('YYYY-MM-DD'),
  );
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
  color: #ffffff90;
  font-size: ${(props) => props.theme.text.size.xs};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  margin-bottom: 4px;
`;

const StyledValue = styled.Text`
  flex: 1;
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
  margin-left: 7px;
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
  flex-direction: row;
  flex-wrap: wrap;
`;

const DateRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
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

const DateItem = ({ date, onPress, selected }) => {
  const dateString = moment(date, 'YYYY-MM-DD').format('DD');
  return (
    <DateTouchable onPress={() => onPress(date)} style={{ backgroundColor: selected ? '#EE6E12' : '#A1AAD310' }}>
      <Text style={{ color: selected ? '#f8f8f8' : '#f8f8f8' }}>{dateString}</Text>
    </DateTouchable>
  );
};

const DateInput = ({ placeholder, value, setValue, label }) => {
  const months = Array.from({ length: 12 }, (_, i) => moment().add(i, 'months'));

  const height = useSharedValue(70);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value, { duration: 300 }),
  }));

  const handlePress = () => {
    height.value = height.value === 70 ? 370 : 70;
  };

  const handleAddMonth = () => {
    const newValue = moment(value, 'YYYY-MM-DD').add(1, 'month').format('YYYY-MM-DD');
    setValue(newValue);
  };

  const handleSubtractMonth = () => {
    const newValue = moment(value, 'YYYY-MM-DD').subtract(1, 'month').format('YYYY-MM-DD');
    setValue(newValue);
  };

  const handleDatePress = (date) => {
    setValue(date);
  };

  return (
    <Touchable onPress={handlePress}>
      <Container style={animatedStyle}>
        {label && <Label>{label.toUpperCase()}</Label>}
        <ValueContainer>
          <StyledValue>{value || placeholder}</StyledValue>
          <Calendar />
        </ValueContainer>
        <SelectorContainer>
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
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth}
            decelerationRate="fast">
            {months.map((month) => {
              return <MonthContainer></MonthContainer>;
            })}
          </DatesContainer>
        </SelectorContainer>
      </Container>
    </Touchable>
  );
};

export default DateInput;
