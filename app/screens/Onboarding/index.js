import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import Chat from './screens/Chat';

const Onboarding = () => {
  const signedIn = useSelector((state) => state.user.signedIn);
  const OnboardingStack = createNativeStackNavigator();

  return (
    <OnboardingStack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      {signedIn ? (
        <OnboardingStack.Screen name="Chat" component={Chat} />
      ) : (
        <OnboardingStack.Screen name="Landing" component={Landing} />
      )}
    </OnboardingStack.Navigator>
  );
};

export default Onboarding;
