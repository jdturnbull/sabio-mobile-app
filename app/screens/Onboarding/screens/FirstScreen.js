import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getIconFromLabel } from '../../../utils/icon';
import { setOnboardingState } from '../../../stores/user/userSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import ContinueButton from '../components/ContinueButton';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  header: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 25,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  subHeader: {
    color: '#ffffff90',
    fontWeight: '500',
    fontSize: 18,
    marginHorizontal: 10,
    lineHeight: 25,
  },
  optionContainer: {
    marginBottom: 30,
  },
  optionBox: {
    backgroundColor: '#1F2025',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  optionText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 18,
  },
});

const FirstScreen = ({ handleNext }) => {
  const width = useWindowDimensions().width;
  const dispatch = useDispatch();

  const onboardingState = useSelector((state) => state.user.onboardingState);
  const [selected, setSelected] = useState(onboardingState.firstScreenSelected || []);

  const options = [
    'Increase Motivation',
    'Develop Technique',
    'Improve health',
    'Prevent Injury',
    'Improve Nutrition',
    'Lose Weight',
    'Improve Flexibility',
  ];

  const handlePress = (option) => {
    setSelected((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const HandleContinue = () => {
    dispatch(setOnboardingState({ ...onboardingState, motivations: selected }));
    handleNext();
  };

  return (
    <View style={{ ...styles.container, width }}>
      <View style={{ ...styles.headerContainer, width: width * 0.9 }}>
        <Text style={styles.header}>
          What brings you to <Text style={{ color: '#E66642', fontWeight: '700' }}>Sabio</Text>?
        </Text>
        <Text style={styles.subHeader}>Help us understand your key focus areas.</Text>
      </View>
      <View style={{ ...styles.optionContainer, width: width * 0.9 }}>
        {options.map((option, index) => (
          <AnimatedPressable
            selected={selected.includes(option)}
            key={index}
            label={option}
            onPress={handlePress}
            Icon={getIconFromLabel(option)}
          />
        ))}
      </View>
      <ContinueButton disabled={selected.length === 0} onPress={HandleContinue} />
    </View>
  );
};

export default FirstScreen;
