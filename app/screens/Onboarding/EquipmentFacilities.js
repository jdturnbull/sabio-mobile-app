import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import extractGoalFromState from '../../utils/extractGoalFromState';
import retrieveCompletion from '../../utils/retrieveCompletion';

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

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const user_state = useSelector((state) => state.user);

  const [selected, setSelected] = useState(user_state?.profile?.equipment_and_facilities?.split(',') || []);

  const state = useSelector((state) => state.onboarding);

  const [isProcessing, setIsProcessing] = useState(false);

  const suggestEquipment = async () => {
    setLoading(true);

    let existing_selections = [];

    if (editMode) {
      existing_selections = user_state?.profile?.equipment_and_facilities?.split(',') || [];
    }

    const goal = extractGoalFromState(state);

    let prompt = `You are a personal trainer. Your client has informed you of their goal: ${goal}\n`;
    prompt += `As their trainer, and with careful consideration of their goal, please return (as JSON) a list of equipment or facilities that will benefit their training.\n`
    prompt += `Just return the equipment or facility, without an explaination for why they need it.\n`
    prompt += `Do not include in your list items that are absolutely necessary for the goal. For example you can safely assume someone with a running goal has access to running shoes.\n`
    prompt += `The equipment or facilities in your list should be things that you may want to assign them to use.\n`
    prompt += `Your list should be a maximum of 20 items.\n`

    if (existing_selections.length > 0) {
      prompt += `Your client already has access to the following equipment or facilities: ${existing_selections.join(', ')}\n`;
      prompt += `Do not return these in your list`
    }

    prompt += `Your response should be in the following format: {list: []}`;

    const response = await retrieveCompletion({ prompt, json: true })
    const { list } = JSON.parse(response)

    const uniqueOptions = Array.from(new Set([...existing_selections, ...list]));
    setOptions(uniqueOptions);

    setLoading(false);
  }

  useEffect(() => {
    if (options.length === 0) {
      suggestEquipment();
    }
  }, [])

  const handleSubmit = async () => {
    if (editMode) {
      Alert.alert(
        'Confirm',
        'This may change your future activities',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              dispatch(updateProfile({ userId: user_state.user.id, data: { equipment_and_facilities: selected.join(',') } }));
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
      return;
    } else {
      dispatch(updateState({ profile: { ...state.profile, equipmentFacilities: selected } }));
      navigation.navigate('RequestNotifications');
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
      setSelected([...selected, opt]);
    }
  };

  const handleBack = () => {
    if (!isProcessing) {
      setIsProcessing(true);
      navigation.goBack();
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  return (
    <Container>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        {editMode && <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>}
        <Title style={{ marginBottom: 0, marginLeft: editMode ? 10 : 0 }}>{editMode ? 'Update equipment' : 'Do you have any favourite equipment or facilities?'}</Title>
      </View>
      <SubHeader style={{ marginBottom: 20 }}>
        Sabio will assume you have the basics, here you can specify anything extra
      </SubHeader>
      <OptionsContainer>
        {loading && <ActivityIndicator />}
        {!loading && options.map((opt) => (
          <SelectableItem key={opt} label={opt} selected={selected.includes(opt)} onPress={() => handleSelect(opt)} />
        ))}
      </OptionsContainer>
      <View style={{ marginTop: 20, flex: 1 }} />
      <NextButton onPress={handleSubmit} editMode={editMode} style={{ marginBottom: 50 }} />
    </Container>
  );
};

export default EquipmentFacilities;
