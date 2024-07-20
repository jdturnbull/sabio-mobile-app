import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, View, Alert } from 'react-native';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import DropDownSelector from '../../components/shared/DropDownSelector';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/onboarding/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const UNITS = ['Pounds', 'Kilograms', 'Stones'];

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const InputWrapper = styled.View``;

const WeightEntry = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const state = useSelector((state) => state.onboarding);

  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [unit, setUnit] = useState('Pounds');

  const handleContinue = () => {
    if (!currentWeight) {
      Alert.alert('Please set your current weight');
      return;
    }
    if (!targetWeight) {
      Alert.alert('Please set your target weight');
      return;
    }
    if (!unit) {
      Alert.alert('Please set your unit');
      return;
    }

    dispatch(updateState({ loseWeight: { ...state.loseWeight, currentWeight, targetWeight, unit } }));
    navigation.navigate('RateAbility');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Title style={{ marginBottom: 10 }}>Current and goal weight</Title>
        <SubHeader style={{ marginBottom: 30 }}>Please enter your details below</SubHeader>
        <InputWrapper>
          <CustomInput
            placeholder={'Weight'}
            value={currentWeight}
            setValue={setCurrentWeight}
            label={'Current weight'}
            keyboardType={'numeric'}
          />
          <CustomInput
            placeholder={'Weight'}
            value={targetWeight}
            setValue={setTargetWeight}
            label={'Goal weight'}
            keyboardType={'numeric'}
          />
        </InputWrapper>
        <DropDownSelector items={UNITS} value={unit} setValue={setUnit} label={'Unit'} />
        <View style={{ flex: 1 }} />
        <NextButton style={{ marginBottom: 20 }} onPress={handleContinue}>
          Continue
        </NextButton>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default WeightEntry;
