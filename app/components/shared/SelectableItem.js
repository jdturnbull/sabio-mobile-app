import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';

const Container = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LabelText = styled.Text`
  flex: 1;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const RingOuter = styled.View`
  height: 26px;
  width: 26px;
  border-radius: 13px;
  border: ${(props) => (props.selected ? '1px solid #EE6E12' : '1px solid #000')};
  background-color: ${(props) => (props.selected ? '#EE6E12' : 'transparent')};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RingInner = styled.View`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? '#000' : 'transparent')};
`;

const SelectableItem = ({ label, onPress, selected }) => {
  const handlePress = () => onPress(label);

  return (
    <Container onPress={handlePress}>
      <LabelText>{label}</LabelText>
      <RingOuter selected={selected}>
        <RingInner selected={selected} />
      </RingOuter>
    </Container>
  );
};

export default SelectableItem;
