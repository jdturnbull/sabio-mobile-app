import React from 'react';
import styled from 'styled-components';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from './Welcome';
import GoalSelect from './GoalSelect';

const screenOpts = {
  cardStyle: { backgroundColor: '#16171B' },
  headerShown: false,
};

const Container = styled.View`
  flex: 1;
`;
const OnboardingStack = createStackNavigator();

const Onboarding = () => {
  return (
    <Container>
      <OnboardingStack.Navigator initialRouteName="Welcome" screenOptions={screenOpts}>
        <OnboardingStack.Screen name="Welcome" component={Welcome} />
        <OnboardingStack.Screen name="GoalSelect" component={GoalSelect} />
      </OnboardingStack.Navigator>
    </Container>
  );
};

export default Onboarding;
