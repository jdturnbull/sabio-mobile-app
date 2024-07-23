import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, View, TouchableOpacity } from 'react-native';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/shared/NextButton';
import { useDispatch } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const GeneralHealth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [specifics, setSpecifics] = useState('');

  const handleSubmit = async () => {
    dispatch(updateState({ generalHealth: { specifics } }));
    navigation.navigate('RateAbility');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Title style={{ marginBottom: 10 }}>Anything specific?</Title>
        <SubHeader style={{ marginBottom: 30 }}>What would you like to improve?</SubHeader>
        <CustomInput
          label={'Optional'}
          placeholder={"Anything you'd like to share"}
          value={specifics}
          setValue={setSpecifics}
          multiline={true}
        />
        <View style={{ flex: 1 }} />
        <NextButton onPress={handleSubmit} style={{ marginBottom: 20 }} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default GeneralHealth;
