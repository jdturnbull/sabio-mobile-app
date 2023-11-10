import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { TouchableWithoutFeedback, GestureHandlerRootView } from 'react-native-gesture-handler';

const Container = styled(TouchableWithoutFeedback)`
  height: 68px;
  align-items: center;
  justify-content: center;
  margin: 9px 0;
`;
const Inner = styled.View`
  align-items: center;
  justify-content: center;
`;

const DayOfWeekContainer = styled.View`
  margin-bottom: 12px;
`;
const DayOfWeekText = styled.Text`
  font-size: 10px;
  font-weight: 700;
`;
const DayOfMonthContainer = styled.View`
  align-items: center;
  justify-content: center;
`;
const DayOfMonthText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const DateItem = ({ date, width, isSelected, isToday, onPress }) => {
  const m = moment.utc(date);

  const colorStyle = {
    color: isSelected ? '#E66642' : isToday ? '#fff' : '#7F8080',
  };

  const handlePress = () => onPress(date);

  return (
    <GestureHandlerRootView style={{ width }}>
      <Container style={{ width }} onPress={handlePress}>
        <Inner>
          <DayOfWeekContainer>
            <DayOfWeekText style={colorStyle}>{m.format('ddd')}</DayOfWeekText>
          </DayOfWeekContainer>
          <DayOfMonthContainer>
            <DayOfMonthText style={colorStyle}>{m.format('D')}</DayOfMonthText>
          </DayOfMonthContainer>
        </Inner>
      </Container>
    </GestureHandlerRootView>
  );
};

export default React.memo(DateItem);
