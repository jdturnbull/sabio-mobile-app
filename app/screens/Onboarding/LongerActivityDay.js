import React, { useState } from 'react';
import styled from 'styled-components';
import Title from '../../components/shared/Title';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SelectableItem from '../../components/shared/SelectableItem';
import NextButton from '../../components/onboarding/NextButton';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
  margin-bottom: 40px;
`;

const LongerActivityDay = () => {
  const [selected, setSelected] = useState();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const state = useSelector((state) => state.onboarding);

  const handlePress = (item) => {
    setSelected(item);
  };

  const handleNext = () => {
    if (!selected) {
      Alert.alert('Please select a day');
    } else {
      dispatch(updateState({ profile: { ...state.profile, longActivityDay: selected } }));
      navigation.navigate('WhenStart');
    }
  };

  return (
    <Container>
      <Title style={{ marginBottom: 10 }}>Which day do you want to do longer activities?</Title>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <SelectableItem key={opt} label={opt} selected={selected === opt} onPress={handlePress} />
        ))}
      </OptionsContainer>
      <NextButton onPress={handleNext} style={{ marginBottom: 40 }}>
        Continue
      </NextButton>
    </Container>
  );
};

export default LongerActivityDay;
