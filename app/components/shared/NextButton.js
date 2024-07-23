import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';

const Container = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.white};
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.sm};
`;

const NextButton = ({ style, onPress, editMode, text }) => {
  return (
    <Container onPress={onPress} style={style}>
      <Text>{text ? text : editMode ? 'Update' : 'Continue'}</Text>
    </Container>
  );
};

export default NextButton;
