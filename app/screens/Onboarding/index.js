import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/onboarding/Header';

import Welcome from './Welcome';
import GoalSelect from './GoalSelect';
import SelectEvent from './SelectEvent';
import CustomGoal from './CustomGoal';
import AddRace from './AddRace';
import RateAbility from './RateAbility';

const OnboardingStack = createStackNavigator();

const Onboarding = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user && user.onboarding_status !== 'COMPLETE') {
      navigation.navigate('AddRace');
    }
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: '#16171B' }}>
      <Header />
      <OnboardingStack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          cardStyle: { backgroundColor: '#16171B' },
          headerShown: false,
        }}>
        <OnboardingStack.Screen name="Welcome" component={Welcome} />
        <OnboardingStack.Screen name="GoalSelect" component={GoalSelect} />
        <OnboardingStack.Screen name="SelectEvent" component={SelectEvent} />
        <OnboardingStack.Screen name="CustomGoal" component={CustomGoal} />
        <OnboardingStack.Screen name="AddRace" component={AddRace} />
        <OnboardingStack.Screen name="RateAbility" component={RateAbility} />
      </OnboardingStack.Navigator>
    </View>
  );
};

export default Onboarding;
