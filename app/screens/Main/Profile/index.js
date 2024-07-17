import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import View from './screens/View';

const ProfileStack = createStackNavigator();

const Profile = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="View">
      <ProfileStack.Screen name="View" component={View} />
    </ProfileStack.Navigator>
  );
};

export default Profile;
