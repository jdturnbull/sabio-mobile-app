import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons/14x/Calendar';
import OptionLabel from './OptionLabel';
import BodyText from './BodyText';

const Container = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #70ee9c10;
  border: 1px solid #70ee9c;
  height: 70px;
  border-radius: 8px;
  padding: 15px;
  margin-top: 12px;
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
  border: 2px solid #70ee9c;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomGoalOption = ({ onPress }) => {
  const handlePress = () => onPress('custom_goal');
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
        <OptionLabel>Enter a custom goal</OptionLabel>
        <BodyText style={{ color: '#ddd' }}>Sabio can train you for anything</BodyText>
      </Right>
    </Container>
  );
};

export default CustomGoalOption;
