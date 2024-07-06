import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import Title from '../../components/shared/Title';
import SelectableItem from '../../components/shared/SelectableItem';
import NextButton from '../../components/onboarding/NextButton';
import SubHeader from '../../components/shared/SubHeader';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const DISTANCES = ['Sprint', 'Olympic', 'Half Ironman', 'Full Ironman'];

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
`;

const TriathlonDistance = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState('Sprint');

  const handlePress = (value) => {
    Keyboard.dismiss();
    setSelected(value);
  };

  const handleContinue = () => {
    if (!selected) {
      Alert.alert('Please select an option');
      return;
    }

    dispatch(updateState({ trainTriathlon: { distance: selected } }));

    navigation.navigate('RateAbility');
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={120}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardOpeningTime={0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title style={{ marginBottom: 10 }}>Triathlon distance</Title>
          <SubHeader>Choose the distance you are training for</SubHeader>
          <OptionsContainer>
            {DISTANCES.map((opt) => {
              return <SelectableItem key={opt} label={opt} onPress={handlePress} selected={selected === opt} />;
            })}
          </OptionsContainer>
          <View style={{ flex: 1 }} />
          <NextButton onPress={handleContinue} style={{ marginBottom: 20 }}>
            Continue
          </NextButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default TriathlonDistance;
