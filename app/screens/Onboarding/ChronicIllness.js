import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Title from '../../components/shared/Title';
import CustomInput from '../../components/shared/CustomInput';
import NextButton from '../../components/shared/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { updateChronicConditions } from '../../stores/user/userSlice';
import { useNavigation } from '@react-navigation/native';
import SelectableItem from '../../components/shared/SelectableItem';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import { usePostHog } from 'posthog-react-native';

const OPTIONS = ['Asthma', 'Diabetes', 'Arthritis', 'Osteoporosis', 'Other'];

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
  const posthog = usePostHog();

  const state = useSelector((state) => state.onboarding);
  const user_state = useSelector((state) => state.user);
  const existing_conditions = useSelector((state) => state.user.chronic_conditions);

  const pre_selected = existing_conditions?.map((c) => {
    if (OPTIONS.includes(c.name)) {
      return c.name;
    }
  }) || [];

  const initialDetails = existing_conditions?.reduce((acc, condition) => {
    if (OPTIONS.includes(condition.name)) {
      acc[condition.name] = condition.details;
    }
    return acc;
  }, {}) || {};

  const [selected, setSelected] = useState(pre_selected || []);
  const [details, setDetails] = useState(initialDetails);

  const handleSubmit = async () => {
    const chronicConditions = selected.map((condition) => ({
      name: condition,
      details: details[condition] || '',
    }));

    if (editMode) {
      posthog.capture('updated_chronic_conditions', { chronic_conditions: chronicConditions });
      dispatch(updateChronicConditions({ userId: user_state.user.id, chronic_conditions: chronicConditions }));
      navigation.goBack();
      return;
    }
    posthog.capture('set_onboarding_chronic_conditions', { chronic_conditions: chronicConditions });
    dispatch(updateState({ profile: { ...state.profile, chronicConditions } }));
    navigation.navigate('EquipmentFacilities');
  };

  const handleSelect = (opt) => {
    if (selected.includes(opt)) {
      setSelected([...selected.filter((s) => s !== opt)]);
      setDetails({ ...details, [opt]: '' });
    } else {
      setSelected([...selected, opt]);
    }
  };

  const handleDetailChange = (opt, value) => {
    setDetails({ ...details, [opt]: value });
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
            {editMode && <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>}
            <Title style={{ marginBottom: 0, marginLeft: editMode ? 10 : 0 }}>{editMode ? 'Update chronic conditions' : 'Do you have any chronic conditions?'}</Title>
          </View>
          <OptionsContainer>
            {OPTIONS.map((opt) => (
              <View key={opt}>
                <SelectableItem onPress={() => handleSelect(opt)} label={opt} selected={selected.includes(opt)} />
                {selected.includes(opt) && (
                  <CustomInput
                    label={`Details for ${opt}`}
                    placeholder={`Enter details for ${opt}`}
                    value={details[opt] || ''}
                    setValue={(value) => handleDetailChange(opt, value)}
                  />
                )}
              </View>
            ))}
          </OptionsContainer>
          <View style={{ flex: 1 }} />
          <NextButton editMode={editMode} onPress={handleSubmit} style={{ marginBottom: editMode ? 0 : 20 }} />
        </Container>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ChronicIllness;
