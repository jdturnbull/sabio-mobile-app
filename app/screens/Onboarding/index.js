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
import RunDistance from './RunDistance';
import SelectTerrain from './SelectTerrain';
import GeneralHealth from './GeneralHealth';
import WhereTrain from './WhereTrain';
import WeightEntry from './WeightEntry';
import TriathlonDistance from './TriathlonDistance';
import GeneralFitness from './GeneralFitness';

const OnboardingStack = createStackNavigator();

const Onboarding = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user && user.onboarding_status !== 'COMPLETE') {
      navigation.navigate('GoalSelect');
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
        <OnboardingStack.Screen name="RunDistance" component={RunDistance} />
        <OnboardingStack.Screen name="SelectTerrain" component={SelectTerrain} />
        <OnboardingStack.Screen name="GeneralHealth" component={GeneralHealth} />
        <OnboardingStack.Screen name="WhereTrain" component={WhereTrain} />
        <OnboardingStack.Screen name="WeightEntry" component={WeightEntry} />
        <OnboardingStack.Screen name="TriathlonDistance" component={TriathlonDistance} />
        <OnboardingStack.Screen name="GeneralFitness" component={GeneralFitness} />
      </OnboardingStack.Navigator>
    </View>
  );
};

export default Onboarding;
