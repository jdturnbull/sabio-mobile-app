import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Container = styled.View``;

const FocusContainer = styled.View``;

const FocusText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.text.colors.white};
`;

const WeekView = ({ week }) => {
  const activities = useSelector((state) => state.user.activities);

  return (
    <Container>
      <FocusContainer>
        <FocusText>{week.focus}</FocusText>
      </FocusContainer>
    </Container>
  );
};

export default WeekView;
