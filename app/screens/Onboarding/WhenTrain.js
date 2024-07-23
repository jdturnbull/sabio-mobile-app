import React, { useState } from 'react';
import styled from 'styled-components';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import SelectableItem from '../../components/shared/SelectableItem';
import NextButton from '../../components/shared/NextButton';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
`;

const WhenTrain = () => {
  const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const state = useSelector((state) => state.onboarding);

  const handlePress = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleNext = () => {
    if (selected.length === 0) {
      Alert.alert('Please select a day');
    } else {
      dispatch(updateState({ profile: { ...state.profile, trainingDays: selected } }));
      navigation.navigate('LongerActivityDay');
    }
  };

  return (
    <Container>
      <Title style={{ marginBottom: 10 }}>When would you like to train?</Title>
      <SubHeader>You can change this later</SubHeader>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <SelectableItem key={opt} label={opt} selected={selected.includes(opt)} onPress={handlePress} />
        ))}
      </OptionsContainer>
      <View style={{ flex: 1 }} />
      <NextButton onPress={handleNext} style={{ marginBottom: 20 }}>
        Continue
      </NextButton>
    </Container>
  );
};

export default WhenTrain;
