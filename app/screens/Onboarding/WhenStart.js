import React, { useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import { TouchableOpacity } from 'react-native';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import DateInput from '../../components/shared/DateInput';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import NextButton from '../../components/shared/NextButton';
import { updateState } from '../../stores/onboarding/onboardingSlice';
import { useNavigation } from '@react-navigation/native';

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

const RecommendedText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.xs};
  color: ${(props) => props.theme.text.colors.darkGrey};
`;

const RingOuter = styled.View`
  height: 26px;
  width: 26px;
  border-radius: 13px;
  border: ${(props) => (props.selected ? '1px solid #EE6E12' : '1px solid #000')};
  background-color: ${(props) => (props.selected ? '#EE6E12' : 'transparent')};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RingInner = styled.View`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? '#000' : 'transparent')};
`;

const WhenStart = () => {
  const user = useSelector((state) => state.user);
  const [date, setDate] = useState(moment.tz(user.timezone).format('YYYY-MM-DD'));

  const dispatch = useDispatch();
  const state = useSelector((state) => state.onboarding);

  const navigation = useNavigation();

  const scrollRef = useRef();

  const today = moment.tz(user.timezone).format('YYYY-MM-DD');
  const tomorrow = moment.tz(user.timezone).add(1, 'day').format('YYYY-MM-DD');

  const monday = moment
    .tz(user.timezone)
    .day(1)
    .add(moment.tz(user.timezone).day() >= 1 ? 7 : 0, 'days')
    .format('YYYY-MM-DD');

  const isSelected = (opt) => {
    if (opt === 'now') {
      if (date === today || date === tomorrow || date === monday) {
        return true;
      } else {
        return false;
      }
    }

    if (opt === 'today') return date === today;
    if (opt === 'tomorrow') return date === tomorrow;
    if (opt === 'monday') return date === monday;
  };

  const handleSubOptionPress = (opt) => {
    if (opt === 'today') setDate(today);
    if (opt === 'tomorrow') setDate(tomorrow);
    if (opt === 'monday') setDate(monday);
  };

  const handleNext = () => {
    if (!date) {
      Alert.alert('Please select a date');
      return;
    }

    dispatch(updateState({ profile: { ...state.profile, startDate: date } }));

    if (state.race?.unit) {
      navigation.navigate('CurrentInjuries');
    } else {
      navigation.navigate('WhichUnits');
    }
  };

  return (
    <Container ref={scrollRef}>
      <Title style={{ marginBottom: 10 }}>When do you want to start your plan?</Title>
      <SubHeader>Pick a day that suits you best</SubHeader>
      <OptionsContainer>
        <NowOption>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <DateText>{moment(date, 'YYYY-MM-DD').format('D MMM YYYY')}</DateText>
            </View>
            <View>
              <RingOuter selected={isSelected('now')}>
                <RingInner selected={isSelected('now')} />
              </RingOuter>
            </View>
          </View>
          <Label>Now</Label>
          <SubOptionBox>
            <SubOption onPress={() => handleSubOptionPress('today')} selected={isSelected('today')}>
              <SubOptionLabel selected={isSelected('today')}>Today</SubOptionLabel>
            </SubOption>
            <SubOption onPress={() => handleSubOptionPress('tomorrow')} selected={isSelected('tomorrow')}>
              <SubOptionLabel selected={isSelected('tomorrow')}>Tomorrow</SubOptionLabel>
            </SubOption>
            <SubOption onPress={() => handleSubOptionPress('monday')} selected={isSelected('monday')}>
              <SubOptionLabel selected={isSelected('monday')}>Monday</SubOptionLabel>
            </SubOption>
          </SubOptionBox>
          <RecommendedText>Recommended for maximum training time</RecommendedText>
        </NowOption>
        <DateInput value={date} setValue={setDate} label={'Plan start date'} />
      </OptionsContainer>
      <View style={{ flex: 1 }} />
      <NextButton style={{ marginBottom: 20 }} onPress={handleNext}>
        Continue
      </NextButton>
    </Container>
  );
};

export default WhenStart;
