import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, View, TouchableOpacity } from 'react-native';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/onboarding/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const PreferredExercises = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const state = useSelector((state) => state.onboarding);

  const [exercises, setExercises] = useState('');

  const handleSubmit = async () => {
    if (exercises) {
      dispatch(updateState({ profile: { ...state.profile, preferredExercises: exercises } }));
    }
    navigation.navigate('PlanLength');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Title style={{ marginBottom: 10 }}>Do you have any preferred activities or exercises?</Title>
        <SubHeader style={{ marginBottom: 30 }}>You can enter details below or skip</SubHeader>
        <CustomInput
          label={'Optional'}
          placeholder={'Any preferred exercises you have'}
          value={exercises}
          setValue={setExercises}
          multiline={true}
        />
        <View style={{ flex: 1 }} />
        <NextButton onPress={handleSubmit} style={{ marginBottom: 20 }} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default PreferredExercises;
