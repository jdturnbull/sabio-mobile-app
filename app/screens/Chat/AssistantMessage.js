import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  background-color: ${(props) => props.theme.colors.background3};
  border-radius: 18px;
  border-top-left-radius: 0px;
  padding-horizontal: 15px;
  padding-vertical: 9px;
  margin-bottom: 20px;
  margin-right: 20px;
  align-self: flex-start;
`;

const StyledText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
`;

const AssistantMessage = ({ message }) => {
  const cleanedMessage = message.replace(/\*\*/g, '');
  return (
    <Container>
      <StyledText>{cleanedMessage}</StyledText>
    </Container>
  );
};

export default AssistantMessage;