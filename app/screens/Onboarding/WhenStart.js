import React, { useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components';
import Title from '../../components/shared/Title';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SubHeader from '../../components/shared/SubHeader';
import { TouchableOpacity } from 'react-native';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import NextButton from '../../components/shared/NextButton';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
import CustomInput from '../../components/shared/CustomInput';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
`;

const NowOption = styled.View`
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const DateText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.xs};
  color: ${(props) => props.theme.text.colors.grey};
  margin-bottom: 10px;
`;

const Label = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
  margin-bottom: 20px;
`;

const SubOptionBox = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const SubOption = styled(TouchableOpacity)`
  background-color: ${(props) => (props.selected ? '#EE6E12' : '#A1AAD315')};
  padding-horizontal: 20px;
  padding-vertical: 8px;
  border-radius: 30px;
  margin-right: 10px;
`;

const SubOptionLabel = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.xs};
  color: ${(props) => props.theme.text.colors.white};
`;

const WhenStart = () => {
  const posthog = usePostHog();
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const state = useSelector((state) => state.onboarding);

  const navigation = useNavigation();

  const scrollRef = useRef();

  const today = moment.tz(user.timezone).format('YYYY-MM-DD');

  const getNextTwoTrainingDays = () => {
    const today = moment.tz(user.timezone);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const trainingDays = state.profile.trainingDays.map(day => daysOfWeek.indexOf(day));

    let nextDays = [];
    let currentDay = today.clone();

    while (nextDays.length < 2) {
      if (trainingDays.includes(currentDay.day())) {
        nextDays.push(currentDay.format('YYYY-MM-DD'));
      }
      currentDay.add(1, 'day');
    }

    return nextDays;
  };

  const [nextTrainingDay1, nextTrainingDay2] = getNextTwoTrainingDays();

  const [date, setDate] = useState(nextTrainingDay1);
  const [age, setAge] = useState(null);

  const isSelected = (_date) => {
    return date === _date
  };

  const handleSubOptionPress = (_date) => {
    setDate(_date);
  };

  const handleNext = () => {
    if (!date) {
      Alert.alert('Please select a date');
      return;
    }

    dispatch(updateState({ profile: { ...state.profile, startDate: date, age: age ? age : null } }));

    if (state.race?.unit) {
      navigation.navigate('ChronicIllness');
    } else {
      navigation.navigate('WhichUnits');
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1, padding: 20 }} extraScrollHeight={80} keyboardOpeningTime={100} ref={scrollRef}>
      <Title style={{ marginBottom: 10 }}>When do you want to start your plan?</Title>
      <SubHeader>Pick one of your next training dates</SubHeader>
      <OptionsContainer>
        <NowOption>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <DateText>{moment(date, 'YYYY-MM-DD').format('D MMM YYYY')}</DateText>
            </View>
          </View>
          <Label>
            {moment(date, 'YYYY-MM-DD').diff(moment(), 'days') === 0
              ? 'Today'
              : moment(date, 'YYYY-MM-DD').diff(moment(), 'days') === 1
                ? 'Tomorrow'
                : `${moment(date, 'YYYY-MM-DD').diff(moment(), 'days')} days from today`}
          </Label>
          <SubOptionBox>
            <SubOption onPress={() => handleSubOptionPress(nextTrainingDay1)} selected={isSelected(nextTrainingDay1)}>
              <SubOptionLabel selected={isSelected(nextTrainingDay1)}>{moment(nextTrainingDay1, 'YYYY-MM-DD').format('dddd, Do')}</SubOptionLabel>
            </SubOption>
            {nextTrainingDay2 && <SubOption onPress={() => handleSubOptionPress(nextTrainingDay2)} selected={isSelected(nextTrainingDay2)}>
              <SubOptionLabel selected={isSelected(nextTrainingDay2)}>{moment(nextTrainingDay2, 'YYYY-MM-DD').format('dddd, Do')}</SubOptionLabel>
            </SubOption>}
          </SubOptionBox>
        </NowOption>
      </OptionsContainer>
      <View style={{ marginTop: 20 }}>
        <Title style={{ marginBottom: 10 }}>What is your age?</Title>
        <SubHeader>This will help us personalise your plan</SubHeader>
        <CustomInput style={{ marginTop: 20 }} keyboardType='numeric' value={age} setValue={setAge} placeholder='Your age' label='Optional' />
      </View>
      <View style={{ flex: 1 }} />
      <NextButton style={{ marginBottom: 20 }} onPress={handleNext}>
        Continue
      </NextButton>
    </KeyboardAwareScrollView>
  );
};

export default WhenStart;
