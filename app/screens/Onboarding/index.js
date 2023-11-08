import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import FirstScreen from './screens/FirstScreen';
import SecondScreen from './screens/SecondScreen';
import ThirdScreen from './screens/ThirdScreen';
import GoalChat from './screens/GoalChat';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const onboardingState = useSelector((state) => state.user.onboardingState);

  const width = useWindowDimensions().width;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: step * -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step, slideAnim]);

  const nextStep = () => {
    setStep((currentStep) => currentStep + 1);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.screenContainer,
          {
            width: width * 4,
            transform: [{ translateX: slideAnim }],
          },
        ]}>
        <FirstScreen handleNext={nextStep} />
        <SecondScreen handleNext={nextStep} />
        {onboardingState.goal === 'Custom - Chat with Sabio' && <GoalChat handleNext={nextStep} />}
        <ThirdScreen handleNext={nextStep} />
      </Animated.View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1013',
  },

  screenContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 80,
  },
});
