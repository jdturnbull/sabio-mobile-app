import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import Chat from './screens/Chat';

const Onboarding = () => {
  const OnboardingStack = createNativeStackNavigator();

  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Landing" component={Landing} />
      <OnboardingStack.Screen name="Chat" component={Chat} />
    </OnboardingStack.Navigator>
  );
};

export default Onboarding;
