import React from 'react';
import styled from 'styled-components';
import { View, Text } from 'react-native';

const Container = styled.View`
  background-color: ${(props) => props.theme.text.chatMessage.backgroundUser};
  border-radius: 18px;
  border-top-right-radius: 0px;
  padding-horizontal: 15px;
  padding-vertical: 9px;
  margin-bottom: 20px;
  margin-left: 45px;
  margin-right: 28px;
  align-self: flex-end;
`;

const StyledText = styled.Text`
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const UserMessage = ({ message }) => {
  return (
    <Container>
      <StyledText>{message}</StyledText>
    </Container>
  );
};

export default UserMessage;
