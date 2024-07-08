import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import CircularProgress from 'react-native-circular-progress-indicator';
import BodyText from './BodyText';

const Container = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  border: ${(props) => (props.selected ? '2px solid #EE6E12' : `2px solid transparent`)};
  padding: 15px;
  border-radius: 17px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled.View`
  flex: 1;
  margin-left: 15px;
  margin-right: 5px;
`;

const LabelText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
  margin-bottom: 5px;
`;

const Body = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.xs};
  color: ${(props) => props.theme.text.colors.grey};
`;

const LargeSelectionBox = ({ label, body, Icon, onPress, selected }) => {
  const handlePress = () => onPress(label);

  return (
    <Container onPress={handlePress} selected={selected}>
      {Icon && <Icon />}
      <Right>
        <LabelText>{label}</LabelText>
        <Body>{body}</Body>
      </Right>
    </Container>
  );
};

export default LargeSelectionBox;
