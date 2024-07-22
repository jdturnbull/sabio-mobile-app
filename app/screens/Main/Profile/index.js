import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import View from './screens/View';
import EquipmentAndFacilities from '../../Onboarding/EquipmentFacilities';
import PastExperience from '../../Onboarding/RateAbility';


const ProfileStack = createStackNavigator();

const Profile = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="View">
      <ProfileStack.Screen name="View" component={View} />
      <ProfileStack.Screen name="EquipmentAndFacilities">
        {(props) => <EquipmentAndFacilities {...props} editMode={true} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name="PastExperience">
        {(props) => <PastExperience {...props} editMode={true} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
};

export default Profile;


const navigationMap = {
  'Equipment and facilities': 'EquipmentAndFacilities',
  'Past experience': 'PastExperience',
  'Injuries': 'Injuries',
  'Medications': 'Medications',
  'Chronic conditions': 'ChronicConditions',
  'Training preferences': 'TrainingPreferences',
  'Training schedules': 'TrainingSchedules',
  'Training locations': 'TrainingLocations',
};