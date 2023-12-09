import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  background-color: ${(props) => props.theme.text.chatMessage.backgroundAssistant};
  border-radius: 18px;
  border-top-left-radius: 0px;
  padding-horizontal: 15px;
  padding-vertical: 9px;
  margin-bottom: 20px;
  margin-left: 28px;
  margin-right: 45px;
  align-self: flex-start;
`;

const StyledText = styled.Text`
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const AssistantMessage = ({ message }) => {
  return (
    <Container>
      <StyledText>{message}</StyledText>
    </Container>
  );
};

export default AssistantMessage;
