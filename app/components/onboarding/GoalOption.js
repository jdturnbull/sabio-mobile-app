import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import OptionLabel from './OptionLabel';

const Container = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #49548a10;
  border: 1px solid #49548a;
  height: 60px;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
`;

const Left = styled.View`
  display: flex;
  height: 100%;
  justify-content: center;
  margin-right: 15px;
`;

const Right = styled.View`
  flex: 1;
`;

const IconOuterRing = styled.View`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  border: 1px solid #f8f8f8;
`;

const IconInnerRing = styled.View`
  height: 28px;
  width: 28px;
  border-radius: 14px;
  border: 2px solid #49548a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomGoalOption = ({ onPress, option }) => {
  const { id, label, Icon } = option;

  const handlePress = () => onPress(id);
  return (
    <Container onPress={handlePress}>
      <Left>
        <IconOuterRing>
          <IconInnerRing>
            <Icon />
          </IconInnerRing>
        </IconOuterRing>
      </Left>
      <Right>
        <OptionLabel>{label}</OptionLabel>
      </Right>
    </Container>
  );
};

export default CustomGoalOption;
