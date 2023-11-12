import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import Chat from './screens/Chat';
import Login from './screens/Login';

const Onboarding = () => {
  const OnboardingStack = createNativeStackNavigator();

  return (
    <OnboardingStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Landing" component={Landing} />
      <OnboardingStack.Screen name="Chat" component={Chat} />
      <OnboardingStack.Screen name="Login" component={Login} />
    </OnboardingStack.Navigator>
  );
};

export default Onboarding;
