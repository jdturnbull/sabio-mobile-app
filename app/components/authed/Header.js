import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity, View } from 'react-native';
import { WalkthroughElement } from 'react-native-walkthrough';
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
  margin-horizontal: 10px;
`;

const Badge = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
`;

const Header = () => {
  const navigation = useNavigation();
  const training_plans = useSelector(state => state.user.training_plans);
  const training_plan = training_plans?.find(plan => plan.status === 'ACTIVE');

  const notifications = useSelector((state) => state.user.notifications);

  let showAlertOnBell = false;

  for (let i = 0; i < notifications?.length; i++) {
    if (notifications[i].status === 'PENDING' && notifications[i].type === 'display_only') {
      showAlertOnBell = true;
    }
  }

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

  const charLength = training_plan?.name.trim().split('').length || 0;

  const ROUTE_LABEL_MAP = {
    Plan: charLength < 30 ? training_plan?.name.trim() : 'Your Plan',
    Main: charLength < 30 ? training_plan?.name.trim() : 'Your Plan',
    Progress: 'Your Progress',
    Community: 'Community',
    Profile: 'Profile',
  };

  return (
    <Container>
      <TouchableOpacity style={{ padding: 8 }} onPress={handleBellPress}>
        <View>
          <Bell />
          {showAlertOnBell && <Badge />}
        </View>
      </TouchableOpacity>
      <TitleContainer>
        <Title>{ROUTE_LABEL_MAP[route]}</Title>
      </TitleContainer>
      <TouchableOpacity style={{ padding: 8 }} onPress={handleAccountPress}>
        <Account />
      </TouchableOpacity>
    </Container >
  );
};

export default Header;
