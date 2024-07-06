import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons/14x/Calendar';
import OptionLabel from './OptionLabel';
import BodyText from '../shared/BodyText';

const Container = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ee6e1210;
  border: 1px solid #ee6e12;
  height: 70px;
  border-radius: 8px;
  padding: 15px;
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
  border: 2px solid #ee6e12;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RaceEventOption = ({ onPress }) => {
  const handlePress = () => onPress('race_an_event');
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
        <OptionLabel>Race an event</OptionLabel>
        <BodyText style={{ color: '#ddd' }}>Select your race from our list</BodyText>
      </Right>
    </Container>
  );
};

export default RaceEventOption;
