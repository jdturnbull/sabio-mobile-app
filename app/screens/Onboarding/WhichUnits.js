import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import SelectableItem from '../../components/shared/SelectableItem';
import NextButton from '../../components/shared/NextButton';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

const OPTIONS = ['Kilometers', 'Miles'];

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
  margin-bottom: 40px;
`;

const WhichUnits = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.onboarding);
  const [selected, setSelected] = useState('Kilometers');
  const navigation = useNavigation();

  const handleNext = () => {
    if (!selected) {
      Alert.alert('Please select an option');
      return;
    }

    dispatch(updateState({ profile: { ...state.profile, preferredUnit: selected } }));
    navigation.navigate('ChronicIllness');
  };
  return (
    <Container>
      <Title style={{ marginBottom: 10 }}>Which units would you like your plan to be displayed in?</Title>
      <SubHeader>Be careful! You can't change this later without creating a new plan</SubHeader>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <SelectableItem onPress={setSelected} key={opt} label={opt} selected={opt === selected} />
        ))}
      </OptionsContainer>
      <View style={{ flex: 1 }} />
      <NextButton style={{ marginBottom: 20 }} onPress={handleNext}>
        Continue
      </NextButton>
    </Container>
  );
};

export default WhichUnits;
