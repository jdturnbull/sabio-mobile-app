import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import Payment from './screens/Payment';
import Chat from './screens/Chat';

const Onboarding = () => {
  const signedIn = useSelector((state) => state.user.signedIn);
  const subscriptionStatus = useSelector((state) => state.user.session?.user?.subscriptionStatus);
  const OnboardingStack = createNativeStackNavigator();

  return (
    <OnboardingStack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      {signedIn && subscriptionStatus === 'SUBSCRIBED' ? (
        <OnboardingStack.Screen name="Chat" component={Chat} />
      ) : signedIn && subscriptionStatus !== 'SUBSCRIBED' ? (
        <OnboardingStack.Screen name="Payment" component={Payment} />
      ) : (
        <OnboardingStack.Screen name="Landing" component={Landing} />
      )}
    </OnboardingStack.Navigator>
  );
};

export default Onboarding;
