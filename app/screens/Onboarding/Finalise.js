import React, { useState, useEffect } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import styled, { useTheme } from 'styled-components';
import DatePicker from 'react-native-date-picker';
import SafariView from 'react-native-safari-view';
import call from '../../utils/call';
import { useDispatch, useSelector } from 'react-redux';
import { getIconFromLabel } from '../../utils/icon';
import { setup } from '../../stores/user/userSlice';
import { useMixpanel } from '../../hooks/useMixpanel';

// Gather some data that is essential to make the plan bug free
// This is going to be the goal date.

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background1};
  padding-top: ${(props) => props.theme.spacing.safeAreaViewSmall};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

const Headline = styled.Text`
  margin-top: 10%;
  margin-bottom: 13%;
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const ItemContainer = styled.View`
  margin-bottom: 40px;
`;

const ItemLabel = styled.Text`
  color: ${(props) => props.theme.colors.labelColor};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  margin-bottom: 5px;
`;

const LabelContainer = styled.View``;

const ItemSubLabel = styled.Text`
  color: ${(props) => `${props.theme.waitingScreen.smallText}`};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const DaysContainer = styled.View`
  margin-top: 20px;
`;

const DaySelectable = styled.Pressable`
  margin-bottom: 10px;
  border: ${(props) =>
    props.selected
      ? `1px solid ${props.theme.finalOnboarding.daySelectedBorder}`
      : `1px solid ${props.theme.finalOnboarding.dayBorder}`};
  padding: 10px;
  border-radius: 8px;
`;

const DayText = styled.Text`
  color: ${(props) =>
    props.selected ? props.theme.finalOnboarding.daySelectedBorder : props.theme.finalOnboarding.dayBorder};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const ConnectButton = styled.Pressable`
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  margin-left: 5px;
`;

const NextButton = styled.Pressable`
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
`;

const NextButtonText = styled.Text`
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  margin-left: 5px;
`;

const Finalise = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const track = useMixpanel();
  const session = useSelector((state) => state.user.session);
  const [connected, setConnected] = useState(session.user?.onboardingData?.hasMadeConnection || false);

  const [date, setDate] = useState(new Date());
  const [restDays, setRestDays] = useState([]);

  useEffect(() => {
    track('SCREEN_VIEW', { screen: 'Finalise' });
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const openConnection = async () => {
    track('USER_ACTION', { action: 'Pressed connect Strava', screen: 'Finalise' });
    const url = await call('GET', `connect/getUrl/strava/${session.user?.id}`);
    SafariView.show({ url });
  };

  // Handles closing the safari view when the user has connected their strava
  const handleSafariViewOpen = async () => {
    let timeoutId = null;

    const _captureResponse = async () => {
      try {
        // Retrieve the connections from the backend
        const response = await call('GET', `connect/list/${session.user?.id}`);

        if (response.length === 0) {
          // If the user hasn't connected their watch, run the function again in 2 seconds
          timeoutId = setTimeout(_captureResponse, 2000);
        } else {
          // If the user has connected their watch, close the safari view
          track('USER_ACTION', { action: 'Connected Strava', screen: 'Finalise' });
          setConnected(true);
          SafariView.dismiss();
        }
      } catch (error) {
        track('ERROR', { screen: 'Finalise', error: error.message });
        console.log("Error retrieving user's connections" + error.message);
      }
    };

    _captureResponse();

    // Cleanup function to clear the timeout when the component unmounts or before the useEffect runs again
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  };

  // Handles the user manually closing the safari view
  const handleSafariViewDismiss = async () => {
    const response = await call('GET', `connect/list/${session.user?.id}`);

    if (response.length > 0) {
      setConnected(true);
    }
  };

  // Event listener to handle user manually closing the safari view
  useEffect(() => {
    SafariView.addEventListener('onShow', handleSafariViewOpen);
    SafariView.addEventListener('onDismiss', handleSafariViewDismiss);
  }, []);

  const Tick = getIconFromLabel('tick');
  const StravaIcon = getIconFromLabel('strava');

  const handleNext = async () => {
    track('USER_ACTION', { action: 'Pressed create my plan', screen: 'Finalise' });
    // Check if date is atleast a month in the future, and max a year in the future
    const today = new Date();
    const goalDate = new Date(date);
    const timeDiff = goalDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff < 30 || daysDiff > 365) {
      track('APP_ACTION', { action: 'Stopped navigation, invalid date', screen: 'Finalise' });
      Alert.alert('Invalid date', 'Please select a date that is at least a month in the future and at most a year');
    } else {
      const response = await call('POST', `users/completeOnboarding`, {
        userId: session.user?.id,
        onboardingData: {
          restDays,
          goalDate: date,
        },
      });

      track('APP_ACTION', { action: 'Completed onboarding', screen: 'Finalise' });

      dispatch(setup());
    }
  };

  return (
    <Container>
      <Content>
        <Headline>
          Last bit! Let's <Text style={{ color: theme.colors.primary }}>finalise your plan</Text>
        </Headline>
        {/* First lets get them to select the days they'd like to train */}
        <ItemContainer>
          <LabelContainer>
            <ItemLabel>On which days would you like to rest?</ItemLabel>
            <ItemSubLabel>You can change these later</ItemSubLabel>
          </LabelContainer>
          <DaysContainer>
            {days.map((day, index) => {
              const handlePress = () => {
                restDays.includes(day.toLowerCase())
                  ? setRestDays(restDays.filter((item) => item !== day.toLowerCase()))
                  : setRestDays([...restDays, day.toLowerCase()]);
              };

              return (
                <DaySelectable key={day} selected={restDays.includes(day.toLowerCase())} onPress={handlePress}>
                  <DayText selected={restDays.includes(day.toLowerCase())}>{day}</DayText>
                </DaySelectable>
              );
            })}
          </DaysContainer>
        </ItemContainer>
        <ItemContainer style={{ marginBottom: 20 }}>
          <LabelContainer style={{ marginBottom: 20 }}>
            <ItemLabel>Set a goal completion date</ItemLabel>
            <ItemSubLabel>This is vital for Sabio's stategy</ItemSubLabel>
          </LabelContainer>
          <DatePicker mode="date" date={date} onDateChange={setDate} />
        </ItemContainer>
        <ItemContainer>
          <LabelContainer style={{ marginBottom: 20 }}>
            <ItemLabel>Let's get your Strava connected</ItemLabel>
            <ItemSubLabel>You can change these later</ItemSubLabel>
          </LabelContainer>
          <ConnectButton onPress={openConnection}>
            {connected ? <Tick color={theme.colors.primary} /> : <StravaIcon color={theme.colors.primary} />}
            <ButtonText>{connected ? 'Connected' : 'Connect Strava'}</ButtonText>
          </ConnectButton>
        </ItemContainer>
        {/* Now they select the date they'd like to achieve their goal by */}
        {/* Finally they connect their Strava */}
        <ItemContainer>
          <NextButton onPress={handleNext}>
            <NextButtonText>Create my plan</NextButtonText>
          </NextButton>
        </ItemContainer>
      </Content>
    </Container>
  );
};

export default Finalise;
