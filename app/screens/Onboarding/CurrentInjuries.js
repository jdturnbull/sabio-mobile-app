import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/shared/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const CurrentInjuries = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const state = useSelector((state) => state.onboarding);

  const [specifics, setSpecifics] = useState('');

  const handleSubmit = async () => {
    if (specifics) {
      dispatch(updateState({ profile: { ...state.profile, currentInjuries: specifics } }));
    }

    navigation.navigate('ChronicIllness');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Title style={{ marginBottom: 10 }}>Do you have any current injuries?</Title>
        <SubHeader style={{ marginBottom: 30 }}>Press continue to skip</SubHeader>
        <CustomInput
          label={'Optional'}
          placeholder={'Description of injury'}
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

export default CurrentInjuries;
