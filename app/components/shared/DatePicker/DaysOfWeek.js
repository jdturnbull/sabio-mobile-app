import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 12px 0 12px 0;
`;
const DayContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const DayText = styled.Text`
  color: #979797;
  font-size: 14px;
`;

const DaysOfWeek = () => {
  return (
    <Container>
      <DayContainer>
        <DayText>M</DayText>
      </DayContainer>
      <DayContainer>
        <DayText>T</DayText>
      </DayContainer>
      <DayContainer>
        <DayText>W</DayText>
      </DayContainer>
      <DayContainer>
        <DayText>T</DayText>
      </DayContainer>
      <DayContainer>
        <DayText>F</DayText>
      </DayContainer>
      <DayContainer>
        <DayText>S</DayText>
      </DayContainer>
      <DayContainer>
        <DayText>S</DayText>
      </DayContainer>
    </Container>
  );
};

export default DaysOfWeek;
