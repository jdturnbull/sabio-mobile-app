import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alert, View } from 'react-native';
import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import { useDispatch, useSelector } from 'react-redux';
import PlanLengthSelectionBox from '../../components/onboarding/PlanLengthSelectionBox';
import NextButton from '../../components/shared/NextButton';
import { updateState } from '../../stores/onboarding/onboardingSlice';

const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
  margin-bottom: 40px;
`;

const PlanLength = () => {
  const user = useSelector((state) => state.user);
  const state = useSelector((state) => state.onboarding);

  const start = moment.tz(state.profile.startDate, user.timezone);

  const navigation = useNavigation();

  const [selected, setSelected] = useState('16 Weeks');
  const [weeks, setWeeks] = useState(16);
  const [date, setDate] = useState(start.format('YYYY-MM-DD'));

  const dispatch = useDispatch();

  const OPTIONS = [
    {
      label: 'Custom Length',
      subLabel: '4 - 45 weeks',
    },
    {
      label: '14 Weeks',
      endDate: start.clone().add(14, 'weeks').format('DD MMM YYYY'),
    },
    {
      label: '16 Weeks',
      endDate: start.clone().add(16, 'weeks').format('DD MMM YYYY'),
    },
    {
      label: '20 Weeks',
      endDate: start.clone().add(20, 'weeks').format('DD MMM YYYY'),
    },
    { label: 'Custom Date' },
  ];

  const handleNext = () => {
    if (!selected) {
      Alert.alert('Please select an option');
    }

    if (selected === 'Custom Length' && weeks < 4) {
      Alert.alert('Minimum plan length is 4 weeks');
      return;
    }

    if (selected === 'Custom Length' && weeks > 45) {
      Alert.alert('Maximum plan length is 45 weeks');
      return;
    }

    if (selected === 'Custom Length' && !weeks) {
      Alert.alert('Please select plan length (weeks)');
      return;
    }

    if (selected === 'Custom Date' && !date) {
      Alert.alert('Please select an end date');
      return;
    }

    if (selected === 'Custom Date' && moment(date).isBefore(start.clone().add(1, 'month'))) {
      Alert.alert('The selected end date must be at least one month from your start date');
      return;
    }

    if (selected === 'Custom Date' && moment(date).isAfter(moment().add(45, 'weeks'))) {
      Alert.alert('The selected end date must be within 45 weeks from now');
      return;
    }

    if (selected === 'Custom Date') {
      dispatch(updateState({ profile: { ...state.profile, planLength: { selected, date } } }));
      navigation.navigate('WhenTrain');
      return;
    }

    if (selected === 'Custom Length') {
      dispatch(updateState({ profile: { ...state.profile, planLength: { selected, weeks } } }));
      navigation.navigate('WhenTrain');
      return;
    }

    if (selected !== 'Custom Length' && selected !== 'Custom Date') {
      dispatch(updateState({ profile: { ...state.profile, planLength: { selected } } }));
      navigation.navigate('WhenTrain');
      return;
    }
  };

  return (
    <Container>
      <Title style={{ marginBottom: 10 }}>How long do you want your plan to be?</Title>
      <SubHeader>Choose how long you'd like to train for</SubHeader>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <PlanLengthSelectionBox
            key={opt.label}
            item={opt}
            selected={opt.label === selected}
            setSelected={setSelected}
            weeks={weeks}
            setWeeks={setWeeks}
            date={date}
            setDate={setDate}
            reccomended={opt.label === '16 Weeks'}
          />
        ))}
      </OptionsContainer>
      <NextButton onPress={handleNext}>Continue</NextButton>
      <View style={{ height: 100 }} />
    </Container>
  );
};

export default PlanLength;