import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Reports from './screens/Reports';

const ProgressStack = createStackNavigator();

const Progress = () => {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Reports">
      <ProgressStack.Screen name="Reports" component={Reports} />
    </ProgressStack.Navigator>
  );
};

export default Progress;
