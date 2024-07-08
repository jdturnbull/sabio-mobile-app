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

const OPTIONS = ['Asthma', 'Diabetes', 'Arthritis', 'Osteoporosis', 'High Blood Pressure', 'Other'];

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-bottom: 10px;
`;

const ChronicIllness = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selected, setSelected] = useState([]);

  const state = useSelector((state) => state.onboarding);

  const [details, setDetails] = useState('');

  const handleSubmit = async () => {
    dispatch(updateState({ profile: { ...state.profile, chronicConditions: { conditions: selected, details } } }));
    navigation.navigate('');
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
          <Title style={{ marginBottom: 20 }}>Do you have any chronic conditions?</Title>
          <OptionsContainer>
            {OPTIONS.map((opt) => (
              <SelectableItem key={opt} onPress={handleSelect} label={opt} selected={selected.includes(opt)} />
            ))}
          </OptionsContainer>
          <CustomInput
            label={'Optional'}
            placeholder={'Example: Arthritis location'}
            value={details}
            setValue={setDetails}
          />
          <View style={{ flex: 1 }} />
          <NextButton onPress={handleSubmit} style={{ marginBottom: 20 }} />
        </Container>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ChronicIllness;
