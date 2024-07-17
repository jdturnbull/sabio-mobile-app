import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Slider from './screens/Slider';
import Overview from './screens/Overview';
import Replan from './screens/Replan';
import AddActivity from './screens/AddActivity';
import ViewActivity from './screens/ViewActivity';

const PlanStack = createStackNavigator();

const Plan = () => {
  return (
    <PlanStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Slider">
      <PlanStack.Screen name="Slider" component={Slider} />
      <PlanStack.Screen name="Overview" component={Overview} />
      <PlanStack.Screen name="Replan" component={Replan} />
      <PlanStack.Screen name="ViewActivity" component={ViewActivity} />
      <PlanStack.Screen name="AddActivity" component={AddActivity} />
    </PlanStack.Navigator>
  );
};

export default Plan;
