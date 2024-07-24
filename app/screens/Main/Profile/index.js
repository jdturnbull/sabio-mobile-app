import React, { useEffect } from 'react';
import styled from 'styled-components';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigationState } from '@react-navigation/native';
import View from './screens/View';
import EquipmentAndFacilities from '../../Onboarding/EquipmentFacilities';
import PastExperience from '../../Onboarding/RateAbility';
import Injuries from './screens/Injuries';
import Medications from './screens/Medications';
import ChronicIllness from '../../Onboarding/ChronicIllness';
import Preferences from './screens/Preferences';
import Schedules from './screens/Schedules';

const Container = styled.View`
  flex: 1;
  padding-top: ${(props) => props.active ? '50px' : '0px'};
  background-color: ${(props) => props.theme.colors.background};
`;

const HeaderView = styled.View`
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
`;


const ProfileStack = createStackNavigator();

const Profile = () => {
  const navigationState = useNavigationState(state => state);
  const activeRoute = navigationState.routes[navigationState.index];
  const activeStackRoute = activeRoute.state ? activeRoute.state.routes[activeRoute.state.index].name : activeRoute.name;



  return (
    <Container>
      <ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="View">
        <ProfileStack.Screen name="View" component={View} />
        <ProfileStack.Screen name="EquipmentAndFacilities">
          {(props) => <EquipmentAndFacilities {...props} editMode={true} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="PastExperience">
          {(props) => <PastExperience {...props} editMode={true} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="Injuries">
          {(props) => <Injuries {...props} editMode={true} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="Medications">
          {(props) => <Medications {...props} editMode={true} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="ChronicIllness">
          {(props) => <ChronicIllness {...props} editMode={true} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="Preferences">
          {(props) => <Preferences {...props} editMode={true} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="Schedules">
          {(props) => <Schedules {...props} editMode={true} />}
        </ProfileStack.Screen>
      </ProfileStack.Navigator>
    </Container>
  );
};

export default Profile;