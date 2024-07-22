import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Title from '../../components/shared/Title';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/onboarding/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { updateChronicConditions } from '../../stores/user/userSlice';
import { useNavigation } from '@react-navigation/native';
import SelectableItem from '../../components/shared/SelectableItem';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';

const OPTIONS = ['Asthma', 'Diabetes', 'Arthritis', 'Osteoporosis', 'High Blood Pressure', 'Other'];

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const OptionsContainer = styled.View`
  margin-bottom: 10px;
`;

const ChronicIllness = ({ editMode }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const state = useSelector((state) => state.onboarding);
  const user_state = useSelector((state) => state.user);
  const existing_conditions = useSelector((state) => state.user.chronic_conditions);

  const pre_selected = existing_conditions.map((c) => {
    if (OPTIONS.includes(c.name)) {
      return c.name;
    }
  });

  const [selected, setSelected] = useState(pre_selected || []);

  const [details, setDetails] = useState('');

  const handleSubmit = async () => {
    if (editMode) {
      dispatch(updateChronicConditions({ userId: user_state.user.id, chronic_conditions: selected, details }));
      navigation.goBack();
      return;
    }
    dispatch(updateState({ profile: { ...state.profile, chronicConditions: { conditions: selected, details } } }));
    navigation.navigate('EquipmentFacilities');
  };

  const handleSelect = (opt) => {
    if (selected.includes(opt)) {
      setSelected([...selected.filter((s) => s !== opt)]);
    } else {
      setSelected([...selected, opt]);
    }
  };

  return (
    <TouchableWithoutFeedback onLongPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        extraScrollHeight={110}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        keyboardOpeningTime={0}>
        <Container>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            {editMode && <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>}
            <Title style={{ marginBottom: 0, marginLeft: editMode ? 10 : 0 }}>{editMode ? 'Update chronic conditions' : 'Do you have any chronic conditions?'}</Title>
          </View>
          <OptionsContainer>
            {OPTIONS.map((opt) => (
              <SelectableItem key={opt} onPress={handleSelect} label={opt} selected={selected.includes(opt)} />
            ))}
          </OptionsContainer>
          <CustomInput
            label={'Optional information'}
            placeholder={'Example: Arthritis location'}
            value={details}
            setValue={setDetails}
          />
          <View style={{ flex: 1 }} />
          <NextButton editMode={editMode} onPress={handleSubmit} style={{ marginBottom: editMode ? 0 : 20 }} />
        </Container>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ChronicIllness;
