import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import Bell from '../../assets/icons/24x/Bell';
import Account from '../../assets/icons/24x/Account';
import { useNavigation } from '@react-navigation/native';
import { hapticImpact } from '../../utils/haptics';
import { useSelector } from 'react-redux';

const Container = styled.View`
  padding: 20px;
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
`;

const TitleContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const Header = () => {
  const navigation = useNavigation();
  const training_plans = useSelector(state => state.user.training_plans);
  const training_plan = training_plans?.find(plan => plan.status === 'ACTIVE');


  const handleBellPress = () => {
    hapticImpact();
    navigation.navigate('Notifications');
  };

  const handleAccountPress = () => {
    hapticImpact();
    navigation.navigate('Account');
  };

  const parentRoute = navigation.getState().routes[navigation.getState().index];
  const route = parentRoute.state ? parentRoute.state.routes[parentRoute.state.index].name : parentRoute.name;

  const ROUTE_LABEL_MAP = {
    Plan: training_plan?.name || 'Your Plan',
    Main: training_plan?.name || 'Your Plan',
    Progress: 'Your Progress',
    Community: 'Community',
    Profile: 'Profile',
  };


  return (
    <Container>
      <TouchableOpacity onPress={handleBellPress}>
        <Bell />
      </TouchableOpacity>
      <TitleContainer>
        <Title>{ROUTE_LABEL_MAP[route]}</Title>
      </TitleContainer>
      <TouchableOpacity onPress={handleAccountPress}>
        <Account />
      </TouchableOpacity>
    </Container>
  );
};

export default Header;
