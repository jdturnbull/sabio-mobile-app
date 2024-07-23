import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Title from '../../components/shared/Title';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/shared/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';
import SelectableItem from '../../components/shared/SelectableItem';
import SubHeader from '../../components/shared/SubHeader';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import { updateProfile } from '../../stores/user/userSlice';

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
  background-color: ${(props) => props.theme.colors.background};
`;

const OptionsContainer = styled.View`
  margin-bottom: 10px;
`;

const EquipmentFacilities = ({ editMode }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user_state = useSelector((state) => state.user);

  const [selected, setSelected] = useState(user_state?.profile?.equipment_and_facilities?.split(',') || []);

  const state = useSelector((state) => state.onboarding);

  const handleSubmit = async () => {
    if (editMode) {
      dispatch(updateProfile({ userId: user_state.user.id, data: { equipment_and_facilities: selected.join(',') } }));
      navigation.goBack();
      return;
    } else {
      dispatch(updateState({ profile: { ...state.profile, equipmentFacilities: selected } }));
      navigation.navigate('CreatingPlan');
    }
  };

  const handleSelect = (opt) => {
    if (selected.includes(opt)) {
      if (opt === 'All') {
        setSelected([]);
      } else {
        setSelected([...selected.filter((s) => s !== opt)]);
      }
    } else {
      if (opt === 'All') {
        setSelected(OPTIONS);
      } else {
        setSelected([...selected, opt]);
      }
    }
  };

  return (
    <Container>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        {editMode && <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>}
        <Title style={{ marginBottom: 0, marginLeft: editMode ? 10 : 0 }}>Equipment and facilities</Title>
      </View>
      <SubHeader style={{ marginBottom: 20 }}>
        Sabio will assume you have the basics, here you can specify anything extra
      </SubHeader>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <SelectableItem key={opt} onPress={handleSelect} label={opt} selected={selected.includes(opt)} />
        ))}
      </OptionsContainer>
      <NextButton onPress={handleSubmit} editMode={editMode} style={{ marginBottom: 60 }} />
    </Container>
  );
};

export default EquipmentFacilities;
