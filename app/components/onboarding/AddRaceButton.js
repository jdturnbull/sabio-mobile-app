import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons/14x/Calendar';
import OptionLabel from './OptionLabel';
import { useNavigation } from '@react-navigation/native';

const Container = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.backgroundLight2};
  border: 1px solid #a1aad3;
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
  border: 1px solid #fff;
`;

const IconInnerRing = styled.View`
  height: 28px;
  width: 28px;
  border-radius: 14px;
  border: 2px solid #a1aad3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Body = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.xs};
  color: #a1aad3;
`;

const AddRaceButton = () => {
  const navigation = useNavigation();

  const handlePress = () => navigation.navigate('AddRace');

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
        <OptionLabel style={{ fontSize: 16, fontWeight: 500, color: '#fff', letterSpacing: 0.2 }}>
          Don't see your race?
        </OptionLabel>
        <Body>Add your race manually</Body>
      </Right>
    </Container>
  );
};

export default AddRaceButton;
