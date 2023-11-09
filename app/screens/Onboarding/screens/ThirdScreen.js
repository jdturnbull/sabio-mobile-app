import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getIconFromLabel } from '../../../utils/icon';
import { setOnboardingState } from '../../../stores/user/userSlice';
import AnimatedPressable from '../components/AnimatedPressable';
import ContinueButton from '../components/ContinueButton';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20,
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
    marginBottom: 10,
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

const ThirdScreen = ({ handleNext }) => {
  const width = useWindowDimensions().width;
  const dispatch = useDispatch();

  const onboardingState = useSelector((state) => state.user.onboardingState);
  const [selected, setSelected] = useState(onboardingState.goal);

  const options = [
    '5K Run',
    '10K Run',
    'Half Marathon',
    'Marathon',
    'Sprint Triathlon',
    'Olympic Triathlon',
    'Half Ironman',
    'Ironman',
    'Custom - Chat with Sabio',
  ];

  const handlePress = (option) => {
    if (selected === option) {
      setSelected('');
    } else {
      setSelected(option);
    }
  };

  const HandleContinue = () => {
    dispatch(setOnboardingState({ ...onboardingState, goal: selected }));
    handleNext();
  };

  return (
    <View style={{ ...styles.container, width }}>
      <View style={{ ...styles.headerContainer, width: width * 0.9 }}>
        <Text style={styles.header}>
          Let's head to the <Text style={{ color: '#E66642', fontWeight: '700' }}>app</Text>!
        </Text>
        <Text style={styles.subHeader}>Whooo!</Text>
      </View>
      {/* <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ ...styles.optionContainer, width: width * 0.9 }}>
          {options.map((option, index) => (
            <AnimatedPressable
              selected={selected === option}
              key={index}
              label={option}
              onPress={handlePress}
              Icon={getIconFromLabel(option)}
            />
          ))}
        </ScrollView>
      </GestureHandlerRootView> */}
      <ContinueButton disabled={selected.length === 0} onPress={HandleContinue} />
    </View>
  );
};

export default ThirdScreen;
