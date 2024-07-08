import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Title from '../../components/shared/Title';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/onboarding/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';
import SelectableItem from '../../components/shared/SelectableItem';
import SubHeader from '../../components/shared/SubHeader';

const OPTIONS = [
  'Free weights',
  'Swimming pool',
  'Treadmill',
  'Elliptical trainer',
  'Rowing machine',
  'Resistance bands',
  'Yoga mat',
  'Jump rope',
  'Exercise ball (stability ball)',
  'Punching bag',
  'Stationary bike',
];

const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-bottom: 10px;
`;

const EquipmentFacilities = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selected, setSelected] = useState([]);

  const state = useSelector((state) => state.onboarding);

  const handleSubmit = async () => {
    dispatch(updateState({ profile: { ...state.profile, EquipmentFacilities: selected } }));
    navigation.navigate('creatingPlan');
  };

  const handleSelect = (opt) => {
    if (selected.includes(opt)) {
      setSelected([...selected.filter((s) => s !== opt)]);
    } else {
      setSelected([...selected, opt]);
    }
  };

  return (
    <Container>
      <Title style={{ marginBottom: 10 }}>Equipment and facilities access</Title>
      <SubHeader style={{ marginBottom: 20 }}>Select all that are available to you</SubHeader>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <SelectableItem key={opt} onPress={handleSelect} label={opt} selected={selected.includes(opt)} />
        ))}
      </OptionsContainer>
      <NextButton onPress={handleSubmit} style={{ marginBottom: 60 }} />
    </Container>
  );
};

export default EquipmentFacilities;
