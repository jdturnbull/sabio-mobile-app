import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import LargeSelectionBox from '../../components/shared/LargeSelectionBox';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from 'react-native-circular-progress-indicator';
import NextButton from '../../components/shared/NextButton';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import { updateProfile } from '../../stores/user/userSlice';
import { usePostHog } from 'posthog-react-native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
`;

const BeginnerRing = () => (
  <CircularProgress
    value={100 / 4}
    radius={18}
    activeStrokeWidth={8}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const IntermediateRing = () => (
  <CircularProgress
    value={(100 / 4) * 2}
    radius={18}
    activeStrokeWidth={8}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const AdvancedRing = () => (
  <CircularProgress
    value={(100 / 4) * 3}
    radius={18}
    activeStrokeWidth={8}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const EliteRing = () => (
  <CircularProgress
    value={100}
    radius={18}
    activeStrokeWidth={8}
    progressValueColor={'transparent'}
    inActiveStrokeColor={'#16171B'}
    activeStrokeColor={'#EE6E12'}
  />
);

const OPTIONS = [
  {
    label: 'Beginner',
    body: 'You are new to fitness or returning after a long break',
    Icon: BeginnerRing,
  },
  {
    label: 'Intermediate',
    body: 'You have some experience with fitness and are comfortable with basic exercises',
    Icon: IntermediateRing,
  },
  {
    label: 'Advanced',
    body: 'You have a solid fitness base and are looking to challenge yourself further',
    Icon: AdvancedRing,
  },
  {
    label: 'Elite',
    body: 'You are at the peak of your fitness journey, aiming for optimal performance',
    Icon: EliteRing,
  },
];

const RateAbility = ({ editMode }) => {
  const posthog = usePostHog();
  const state = useSelector((state) => state.onboarding);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user_state = useSelector((state) => state.user);

  const pre_selected = OPTIONS.find((opt) => opt.body === user_state?.profile?.past_experience)?.label || 'Beginner';

  const [selected, setSelected] = useState(pre_selected);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePress = (label) => {
    setSelected(label);
  };

  const handleNext = () => {
    if (!selected) {
      Alert.alert('Please select an option');
      return;
    }

    if (editMode) {
      Alert.alert(
        'Confirm',
        'This may change your future activities',
        [
          {
            text: 'Cancel',
            onPress: () => {
              posthog.capture('profile_update_cancelled', { field: 'past_experience' });
            },
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              dispatch(updateProfile({ userId: user_state.user.id, data: { past_experience: OPTIONS.find((opt) => opt.label === selected).body } }));
              posthog.capture('updated_past_experience', { past_experience: OPTIONS.find((opt) => opt.label === selected).body });
              posthog.capture('premium_feature_used', { feature: 'past_experience_update', was_trial: user_state.user?.subscription_status === 'UNSUBSCRIBED' });
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
      return;
    } else {
      dispatch(updateState({ profile: { ...state.profile, ability: selected } }));
      posthog.capture('set_onboarding_ability', { ability: selected });
      if (state.race) {
        navigation.navigate('WhenTrain');
      } else {
        navigation.navigate('PlanLength');
      }
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {editMode && <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>}
        <Title style={{ marginBottom: 0, marginLeft: editMode ? 10 : 0 }}>{editMode ? 'Update current ability' : 'Rate your current ability'}</Title>
      </View>

      {!editMode && <SubHeader>This can be changed later</SubHeader>}
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <LargeSelectionBox
            selected={selected === opt.label}
            key={opt.label}
            label={opt.label}
            Icon={opt.Icon}
            body={opt.body}
            onPress={handlePress}
          />
        ))}
      </OptionsContainer>
      <View style={{ flex: 1 }} />
      <NextButton onPress={handleNext} editMode={editMode} />
    </Container>
  );
};

export default RateAbility;
