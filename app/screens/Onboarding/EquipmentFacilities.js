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
import { usePostHog } from 'posthog-react-native';

const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const OptionsContainer = styled.View`
  margin-bottom: 10px;
`;

const EquipmentFacilities = ({ editMode }) => {
  const posthog = usePostHog();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const [addingCustom, setAddingCustom] = useState(false);
  const [customOption, setCustomOption] = useState('');

  const user_state = useSelector((state) => state.user);

  const [selected, setSelected] = useState((user_state?.profile?.equipment_and_facilities?.split(',') || []).filter(Boolean))

  const state = useSelector((state) => state.onboarding);

  const [isProcessing, setIsProcessing] = useState(false);

  const suggestEquipment = async () => {
    setLoading(true);

    let existing_selections = [];

    if (editMode) {
      existing_selections = selected
    }

    const goal = extractGoalFromState(state);

    let prompt = `You are a personal trainer. Your client has informed you of their goal: ${goal}\n`;
    prompt += `As their trainer, and with careful consideration of their goal, please return (as JSON) a list of equipment or facilities that will benefit their training.\n`
    prompt += `Just return the equipment or facility, without an explaination for why they need it.\n`
    prompt += `Do not include in your list items that are absolutely necessary for the goal. For example you can safely assume someone with a running goal has access to running shoes.\n`
    prompt += `The equipment or facilities in your list should be things that you may want to assign them to use.\n`
    prompt += `Your list should be appropriate to the difficulty of the goal in question: for example, if the goal is to run their first 5k, more extream equipment like a hydration vest or altitude mask shouldnt be suggested.\n`
    prompt += `In addition to the difficulty of the goal, also consider your client's assesment of their own skill level when selecting the equipment. The client has determined their skill level as: ${user_state?.profile?.ability ? user_state?.profile?.ability : 'Beginner'}\n`
    prompt += `Don't include anything relating to software such as a fitness tracker or mobile app.\n`
    prompt += `Don't include anything that doesn't affect the type of activities you provide them, for example forms of clothing shouldn't be included as it won't affect the type of activities you provide them.\n`
    prompt += `Don't include equipment that won't affect the type of activities you provide them, for example a water bottle won't affect the type of activities you provide them.\n`
    prompt += `Your list should be a maximum of 10 items.\n`


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
            onPress: () => {
              posthog.capture('profile_update_cancelled', { field: 'equipment_facilities' });
            },
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              if (customOption !== '') {
                selected.push(customOption);
              }
              dispatch(updateProfile({ userId: user_state.user.id, data: { equipment_and_facilities: selected.join(',') } }));
              posthog.capture('updated_equipment_facilities', { equipment_facilities: selected });
              posthog.capture('premium_feature_used', { feature: 'equipment_facilities_update', was_trial: user_state.user?.subscription_status === 'UNSUBSCRIBED' });
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
      return;
    } else {
      dispatch(updateState({ profile: { ...state.profile, equipmentFacilities: selected } }));
      posthog.capture('set_onboarding_equipment_facilities', { equipment_facilities: selected });
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
    <Container showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        {editMode && <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>}
        <Title style={{ marginBottom: 0, marginLeft: editMode ? 10 : 0 }}>{editMode ? 'Update equipment' : 'Do you have any favourite equipment or facilities?'}</Title>
      </View>
      <SubHeader style={{ marginBottom: 20 }}>
        Sabio will assume you have the basics, here you can specify anything extra
      </SubHeader>
      <OptionsContainer>
        {loading && <ActivityIndicator />}
        {!loading && <View>
          <SelectableItem onPress={() => setAddingCustom(!addingCustom)} label={'Custom'} selected={addingCustom} />
          {addingCustom && (
            <CustomInput
              label={`Press enter to submit`}
              placeholder={`Trampoline`}
              value={customOption}
              setValue={(value) => setCustomOption(value)}
              onSubmitEditing={() => {
                if (customOption.trim() !== '') {
                  setOptions([customOption.trim(), ...options]);
                  setSelected([customOption.trim(), ...selected]);
                  setCustomOption('');
                  setAddingCustom(false);
                }
              }}
            />
          )}
        </View>}
        {!loading && options.map((opt) => (
          <SelectableItem key={opt} label={opt} selected={selected.includes(opt)} onPress={() => handleSelect(opt)} />
        ))}
      </OptionsContainer>
      <View style={{ marginTop: 20, flex: 1 }} />
      {!loading && <NextButton onPress={handleSubmit} editMode={editMode} style={{ marginBottom: 50 }} />}
    </Container>
  );
};

export default EquipmentFacilities;
