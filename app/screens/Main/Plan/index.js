import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigationState, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';

import Slider from './screens/Slider';
import Replan from './screens/Replan';
import AddActivity from './screens/AddActivity';
import ViewDay from './screens/ViewDay';
import { useDispatch, useSelector } from 'react-redux';
import call from '../../../utils/call';
import { updateState } from '../../../stores/user/userSlice';

const PlanStack = createStackNavigator();

const FloatingButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 28px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const Plan = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user?.user);
  const plan_updating = useSelector((state) => state.user.plan_updating);
  const training_plans = useSelector((state) => state.user.training_plans);
  const [weeks, setWeeks] = useState([]);
  const navigationState = useNavigationState(state => state);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const run = async () => {
        const plans = await call('GET', `users/training_plans/${user.id}`);
        dispatch(updateState({ training_plans: plans }));
      }

      run();
    }
  }, [isFocused]);

  const training_plan = useMemo(() => {
    return training_plans?.find(plan => plan.status === 'ACTIVE');
  }, [training_plans]);

  const fetchActivities = useCallback(async () => {
    if (!training_plan) return;

    const activities = await call('GET', `users/activities/${training_plan.id}`);
    const weeksData = training_plan.plan.training_plan.map(week => {
      const week_number = week.week;
      const focus = week.focus;
      const recovery_guidelines = week.recovery_guidelines;
      const nutrition_guidelines = recovery_guidelines?.nutrition_guidelines;

      const week_activities = activities.filter(activity => activity.week === week_number);
      return { week: week_number, activities: week_activities, focus, recovery_guidelines, nutrition_guidelines };
    });
    setWeeks(weeksData);
  }, [training_plan]);

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [fetchActivities, navigationState])
  );

  useEffect(() => {
    if (!plan_updating) {
      fetchActivities();
    }
  }, [plan_updating]);


  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export default Plan;
