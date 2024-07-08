import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import LargeSelectionBox from '../../components/shared/LargeSelectionBox';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from 'react-native-circular-progress-indicator';
import NextButton from '../../components/onboarding/NextButton';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
`;

const BeginnerRing = () => (
  <CircularProgress
    value={100 / 4}
    radius={22.5}
    activeStrokeWidth={12}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const IntermediateRing = () => (
  <CircularProgress
    value={(100 / 4) * 2}
    radius={22.5}
    activeStrokeWidth={12}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const AdvancedRing = () => (
  <CircularProgress
    value={(100 / 4) * 3}
    radius={22.5}
    activeStrokeWidth={12}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const EliteRing = () => (
  <CircularProgress
    value={100}
    radius={22.5}
    activeStrokeWidth={12}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const OPTIONS = [
  {
    label: 'Beginner',
    body: 'You are new to fitness or returning after a long break',
    Icon: BeginnerRing,
  },
  {
    label: 'Intermediate',
    body: 'You have some experience with fitness and are comfortable with basic exercises',
    Icon: IntermediateRing,
  },
  {
    label: 'Advanced',
    body: 'You have a solid fitness base and are looking to challenge yourself further',
    Icon: AdvancedRing,
  },
  {
    label: 'Elite',
    body: 'You are at the peak of your fitness journey, aiming for optimal performance',
    Icon: EliteRing,
  },
];

const RateAbility = () => {
  const state = useSelector((state) => state.onboarding);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('Beginner');

  const handlePress = (label) => {
    setSelected(label);
  };

  const handleNext = () => {
    if (!selected) {
      Alert.alert('Please select an option');
      return;
    }

    dispatch(updateState({ profile: { ...state.profile, ability: selected } }));
    navigation.navigate('PreferredExercises');
  };

  return (
    <Container>
      <Title style={{ marginBottom: 10 }}>Rate your current ability</Title>
      <SubHeader>This can be changed later</SubHeader>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <LargeSelectionBox
            selected={selected === opt.label}
            key={opt.label}
            label={opt.label}
            Icon={opt.Icon}
            body={opt.body}
            onPress={handlePress}
          />
        ))}
      </OptionsContainer>
      <View style={{ flex: 1 }} />
      <NextButton style={{ marginBottom: 20 }} onPress={handleNext}>
        Continue
      </NextButton>
    </Container>
  );
};

export default RateAbility;
