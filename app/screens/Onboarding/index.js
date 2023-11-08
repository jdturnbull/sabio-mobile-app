import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getIconFromLabel } from '../../utils/icon';
import FirstScreen from './screens/FirstScreen';
import SecondScreen from './screens/SecondScreen';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [label, setLabel] = useState('Connect your fitness tracker');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: step * -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step, slideAnim]);

  const nextStep = () => {
    setStep((currentStep) => currentStep + 1);
  };

  // Render your screens based on the step
  const renderScreen = () => {
    switch (step) {
      case 0:
        return <FirstScreen handleNext={nextStep} />;
      case 1:
        return <SecondScreen />;
      // Add more cases for additional screens
    }
  };

  const Icon = getIconFromLabel('LogoLarge');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Animated.View
        style={[
          styles.screenContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}>
        {renderScreen()}
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
  header: {
    display: 'flex',
    height: '30%',
    marginBottom: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    marginTop: 50,
    fontSize: 20,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '300%',
  },
});
