import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigationState, useFocusEffect } from '@react-navigation/native';

import Slider from './screens/Slider';
import Replan from './screens/Replan';
import AddActivity from './screens/AddActivity';
import ViewDay from './screens/ViewDay';
import { useSelector } from 'react-redux';
import call from '../../../utils/call';

const PlanStack = createStackNavigator();

const Plan = () => {
  const training_plans = useSelector((state) => state.user.training_plans);
  const [weeks, setWeeks] = useState([]);
  const navigationState = useNavigationState(state => state);

  const training_plan = useMemo(() => {
    return training_plans?.find(plan => plan.status === 'ACTIVE');
  }, [training_plans]);

  const fetchActivities = useCallback(async () => {
    if (!training_plan) return;

    const activities = await call('GET', `users/activities/${training_plan.id}`);
    const weeksData = training_plan.plan.training_plan.map(week => {
      const week_number = week.week;
      const focus = week.focus;
      const week_activities = activities.filter(activity => activity.week === week_number);
      return { week: week_number, activities: week_activities, focus };
    });
    setWeeks(weeksData);
  }, [training_plan]);

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [fetchActivities, navigationState])
  );

  return (
    <PlanStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Slider">
      <PlanStack.Screen name="Slider">
        {props => <Slider {...props} weeks={weeks} />}
      </PlanStack.Screen>
      <PlanStack.Screen name="Replan">
        {props => <Replan {...props} weeks={weeks} />}
      </PlanStack.Screen>
      <PlanStack.Screen name="ViewDay">
        {props => <ViewDay {...props} fetchActivities={fetchActivities} />}
      </PlanStack.Screen>
      <PlanStack.Screen name="AddActivity" component={AddActivity} />
    </PlanStack.Navigator>
  );
};

export default Plan;
