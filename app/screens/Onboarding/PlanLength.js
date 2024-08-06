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
  const today = moment.tz(user.timezone);

  const navigation = useNavigation();

  const [selected, setSelected] = useState('16 Weeks');
  const [weeks, setWeeks] = useState(12);
  const [date, setDate] = useState(today.format('YYYY-MM-DD'));

  const dispatch = useDispatch();

  const OPTIONS = [
    {
      label: 'Custom Length',
      subLabel: '4 - 52 weeks',
    },
    {
      label: '14 Weeks',
      endDate: today.clone().add(14, 'weeks').format('DD MMM YYYY'),
    },
    {
      label: '16 Weeks',
      endDate: today.clone().add(16, 'weeks').format('DD MMM YYYY'),
    },
    {
      label: '20 Weeks',
      endDate: today.clone().add(16, 'weeks').format('DD MMM YYYY'),
    },
    { label: 'Custom Date', subLabel: '1 - 12 months' },
  ];

  const handleNext = () => {
    if (!selected) {
      Alert.alert('Please select an option');
    }

    if (selected === 'Custom Length' && weeks < 4) {
      Alert.alert('Minimum plan length is 4 weeks');
      return;
    }

    if (selected === 'Custom Length' && weeks > 52) {
      Alert.alert('Maximum plan length is 52 weeks');
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

    if (selected === 'Custom Date' && moment(date).isBefore(today.clone().add(1, 'month'))) {
      Alert.alert('The selected end date must be at least one month from today');
      return;
    }

    if (selected === 'Custom Date' && moment(date).isAfter(today.clone().add(1, 'year'))) {
      Alert.alert('The selected end date must be within one year from today');
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
      <SubHeader>Choose how long you'd to train for (you can change this later)</SubHeader>
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
