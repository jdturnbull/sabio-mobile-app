import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { View, Pressable, Alert, useWindowDimensions, ImageBackground, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import SafariView from 'react-native-safari-view';
import call from '../../../utils/call';
import { getIconFromLabel } from '../../../utils/icon';
import LightBackground from '../../../assets/home-background-light.png';
import DarkBackground from '../../../assets/home-background-dark.png';
import { setup, signout } from '../../../stores/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMixpanel } from '../../../hooks/useMixpanel';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Container = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

const HelloContainer = styled.View`
  margin-top: ${(props) => props.theme.spacing.safeAreaView};
  margin-bottom: 10px;
  padding-horizontal: 10px;
`;

const HelloText = styled.Text`
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const Top = styled.View`
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.settings.topBarColor};
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.lg};
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.text.colors.secondary};
`;

const HeaderSubText = styled.Text`
  font-size: ${(props) => props.theme.text.size.md};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.regular};
  color: ${(props) => props.theme.text.colors.secondary};
  margin-top: 5px;
`;

const Option = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid ${(props) => props.theme.home.cards.borderColorMissed};
  background-color: 'transparent';
  border-bottom-width: 0;
  background-color: ${(props) => props.theme.settings.optionBoxColor};
`;

const OptionText = styled.Text`
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  color: ${(props) => props.theme.settings.optionTextColor};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-family: ${(props) => props.theme.text.family};
`;

const StyledText = styled.Text`
  font-size: ${(props) => props.theme.text.size.lg};
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.settings.labelColor};
  font-family: ${(props) => props.theme.text.family};
`;

const ProgressContainer = styled.View`
  height: 15px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.settingsBackground};
`;

const Progress = styled.View`
  height: 100%;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primary};
`;

const PercentageText = styled.Text`
  margin-top: 5px;
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
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
  font-family: ${(props) => props.theme.text.family};
`;

const Settings = () => {
  const dispatch = useDispatch();
  const { track } = useMixpanel();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [hasConnection, setHasConnection] = useState(false);
  const user = useSelector((state) => state.user.session?.user);
  const activities = useSelector((state) => state.user?.plannedActivities);

  const [restDays, setRestDays] = useState(user?.onboardingData.restDays || []);

  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await call('GET', `connect/list/${user?.id}`);

        if (res.length > 0) {
          setHasConnection(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    checkConnection();
  }, []);

  const handleOptionPress = async (opt) => {
    track('USER_ACTION', { action: 'Settings option pressed', option: opt });

    if (opt === 'support') {
      Alert.alert('support@heysabio.com', '', [{ text: 'OK' }]);
    }

    if (opt === 'newPlan') {
      Alert.alert('Contact support to reset your plan', '', [{ text: 'Cancel' }]);
    }

    if (opt === 'connect') {
      const redirect = await call('GET', `connect/getUrl/strava/${user?.id}`);
      SafariView.show({ url: redirect });
    }

    if (opt === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            track('USER_ACTION', { action: 'Logout' });
            await AsyncStorage.removeItem('session');
            dispatch(setup());
          },
        },
      ]);
    }

    if (opt === 'deleteAccount') {
      Alert.alert('Delete account', 'Are you sure you want to delete your account? This action is permenent.', [
        { text: 'Cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            track('USER_ACTION', { action: 'Account deleted' });
            await call('GET', `users/delete/${user?.id}`);
            await AsyncStorage.removeItem('session');
            dispatch(setup());
          },
        },
      ]);
    }

    if (opt === 'connection') {
      Alert.alert('Manage connections', 'Please chat with Sabio to change your connection', [{ text: 'OK' }]);
    }
  };

  const totalNum = activities?.length || 0;
  const numCompleted = activities?.filter((a) => a.status === 'COMPLETED' || a.status === 'PART_COMPLETED').length || 0;

  // Should skipping rest days mean the rest day is no longer considered in your application.

  const Opt = ({ opt, onPress, icon, label, first, last }) => {
    const Icon = getIconFromLabel(icon);

    const handlePress = () => {
      onPress(opt);
    };

    return (
      <Pressable onPress={handlePress}>
        <Option
          style={
            last
              ? { borderBottomWidth: 1, borderBottomRightRadius: 18, borderBottomLeftRadius: 18 }
              : first
              ? { borderTopRightRadius: 18, borderTopLeftRadius: 18, marginBottom: 3 }
              : { marginBottom: 3 }
          }>
          <OptionText>{label}</OptionText>
          <Icon color={theme.settings.iconColor} />
        </Option>
      </Pressable>
    );
  };

  const progressBarWidth = screenWidth - 40;
  const progressPercentage = (numCompleted / totalNum) * 100;
  const progressWidth = (progressBarWidth * progressPercentage) / 100;

  const ProfileIcon = getIconFromLabel('profile');

  const handleRestDaySelect = async (day) => {
    if (restDays.includes(day.toLowerCase())) {
      try {
        await call('POST', 'users/setRestDays', {
          userId: user.id,
          restDays: restDays.filter((d) => d !== day.toLowerCase()),
        });
        setRestDays(restDays.filter((d) => d !== day.toLowerCase()));
      } catch (error) {
        Alert.alert('Error', 'An error occurred. Please try again later.', [{ text: 'OK' }]);
      }
    } else {
      try {
        await call('POST', 'users/setRestDays', { userId: user.id, restDays: [...restDays, day.toLowerCase()] });
        setRestDays([...restDays, day.toLowerCase()]);
      } catch (error) {
        Alert.alert('Error', 'An error occurred. Please try again later.', [{ text: 'OK' }]);
      }
    }
  };

  return (
    <ImageBackground
      style={colorScheme === 'light' ? { flex: 1, backgroundColor: '#fff' } : { flex: 1, backgroundColor: '#272620' }}
      source={colorScheme === 'light' ? LightBackground : DarkBackground}>
      <Container>
        <HelloContainer>
          <HelloText>
            Your <HelloText style={{ color: theme.text.colors.primary }}>Account</HelloText>
          </HelloText>
        </HelloContainer>
        <Top>
          <ProfileIcon />
          <View style={{ marginLeft: 18 }}>
            <HeaderText>{user?.name}</HeaderText>
            <HeaderSubText>{user?.email}</HeaderSubText>
          </View>
        </Top>
        <View style={{ marginBottom: 30 }}>
          <StyledText style={{ marginVertical: 30 }}>Account Options</StyledText>
          <Opt onPress={handleOptionPress} label={'Start a new plan'} icon={'new'} opt={'newPlan'} first={true} />
          {!hasConnection && (
            <Opt onPress={handleOptionPress} label={'Connect Strava'} icon={'strava'} opt={'connect'} />
          )}
          <Opt onPress={handleOptionPress} label={'Logout'} icon={'logout'} opt={'logout'} />
          <Opt onPress={handleOptionPress} label={'Delete Account'} icon={'stop'} opt={'deleteAccount'} />
          {/* <Opt onPress={handleOptionPress} label={'Manage connections'} icon={'connection'} opt={'connection'} /> */}
          {/* <Opt onPress={handleOptionPress} label={subscriptionText} icon={'subscribe'} opt={'subscription'} /> */}
          <Opt onPress={handleOptionPress} label={'Contact support'} icon={'support'} opt={'support'} last={true} />
        </View>
        <View style={{ flex: 1 }}>
          <StyledText>Plan Completion</StyledText>
          <ProgressContainer style={{ width: progressBarWidth }}>
            <Progress style={{ width: progressWidth }} />
          </ProgressContainer>
          <View style={{ width: '100%', alignItems: 'flex-end' }}>
            <PercentageText>{`${Math.round(progressPercentage * 100) / 100}%`}</PercentageText>
          </View>
        </View>
        <StyledText>Change your rest days</StyledText>
        <DaysContainer>
          {days.map((day, index) => {
            return (
              <DaySelectable
                key={day}
                selected={restDays.includes(day.toLowerCase())}
                onPress={() => handleRestDaySelect(day)}>
                <DayText selected={restDays.includes(day.toLowerCase())}>{day}</DayText>
              </DaySelectable>
            );
          })}
        </DaysContainer>
      </Container>
    </ImageBackground>
  );
};

export default Settings;
