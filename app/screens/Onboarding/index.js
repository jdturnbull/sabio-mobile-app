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
import PlanLength from './PlanLength';
import WhenTrain from './WhenTrain';
import LongerActivityDay from './LongerActivityDay';
import WhenStart from './WhenStart';
import WhichUnits from './WhichUnits';
import ChronicIllness from './ChronicIllness';
import EquipmentFacilities from './EquipmentFacilities';
import RequestNotifications from './RequestNotifications';
import CreatingPlan from './CreatingPlan';

const OnboardingStack = createStackNavigator();

const HIDE_HEADER_STATUSES = ['ANALYSING_DATA', 'GENERATED_HOLISTIC', 'GENERATED_ACTIVITIES', 'COMPLETE'];

const Onboarding = () => {
  const navigation = useNavigation();
  const user_state = useSelector((state) => state.user);

  useEffect(() => {
    if (user_state.user) {
      if (user_state.user.onboarding_status === 'NOT_STARTED' || user_state.user.onboarding_status === 'RESETTING_PLAN') {
        navigation.navigate('GoalSelect');
        return;
      }

      // If we get here then the onboarding_status is being used to indicate a plan step change
      navigation.navigate('CreatingPlan');
    }

  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#16171B' }}>
      {!HIDE_HEADER_STATUSES.includes(user_state?.user?.onboarding_status) && <Header />}
      <OnboardingStack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          cardStyle: { backgroundColor: '#16171B' },
          headerShown: false,
        }}>
        <OnboardingStack.Screen name="Welcome" component={Welcome} />
        <OnboardingStack.Screen name="GoalSelect" component={GoalSelect} options={{ gestureEnabled: false }} />
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
        <OnboardingStack.Screen name="PlanLength" component={PlanLength} />
        <OnboardingStack.Screen name="WhenTrain" component={WhenTrain} />
        <OnboardingStack.Screen name="LongerActivityDay" component={LongerActivityDay} />
        <OnboardingStack.Screen name="WhenStart" component={WhenStart} />
        <OnboardingStack.Screen name="WhichUnits" component={WhichUnits} />
        <OnboardingStack.Screen name="ChronicIllness" component={ChronicIllness} />
        <OnboardingStack.Screen name="EquipmentFacilities" component={EquipmentFacilities} />
        <OnboardingStack.Screen name="RequestNotifications" component={RequestNotifications} />
        <OnboardingStack.Screen name="CreatingPlan" component={CreatingPlan} />
      </OnboardingStack.Navigator>
    </View>
  );
};

export default Onboarding;
