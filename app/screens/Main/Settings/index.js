import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { View, Pressable, Alert, useWindowDimensions, ImageBackground, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import SafariView from 'react-native-safari-view';
import moment from 'moment';

import call from '../../../utils/call';
import { getIconFromLabel } from '../../../utils/icon';
import LightBackground from '../../../assets/home-background-light.png';
import DarkBackground from '../../../assets/home-background-dark.png';
import { setup, signout } from '../../../stores/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMixpanel } from '../../../hooks/useMixpanel';

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
  font-size: ${(props) => props.theme.text.size.lg};
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.text.colors.secondary};
`;

const HeaderSubText = styled.Text`
  font-size: ${(props) => props.theme.text.size.md};
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
`;

const InformationContainer = styled.Pressable`
  display: flex;
  padding: 15px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 0;
  background-color: ${(props) => props.theme.settings.optionBoxColor};
`;

const InformationText = styled.Text`
  line-height: 20px;
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.settings.optionTextColor};
  font-family: ${(props) => props.theme.text.family};
`;

const InformationBox = ({ title, value, onPress, id, last, first }) => {
  const handlePress = () => onPress(id);

  return (
    <InformationContainer
      style={
        last
          ? { marginBottom: 50, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }
          : first
          ? { borderTopLeftRadius: 18, borderTopRightRadius: 18, marginBottom: 3 }
          : { marginBottom: 3 }
      }
      onPress={handlePress}>
      <InformationText>
        <InformationText style={{ fontWeight: 600 }}>{title}</InformationText> {value}
      </InformationText>
    </InformationContainer>
  );
};

const Settings = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { track } = useMixpanel();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [hasConnection, setHasConnection] = useState(false);
  const user = useSelector((state) => state.user.session?.user);
  const activities = useSelector((state) => state.user?.plannedActivities);

  const [modalOpen, setModalOpen] = useState(false);

  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await call('GET', `connect/list/${user?.id}`);

        if (res.length > 0) {
          setHasConnection(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkConnection();
  }, []);

  const handleResetConfirm = async () => {
    try {
      await call('GET', `users/reset/${user?.id}`);
      Alert.alert('Plan reset', '', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Failed to reset plan, please contact support', '', [{ text: 'OK' }]);
    }
  };

  const handleOptionPress = async (opt) => {
    track('USER_ACTION', { action: 'Settings option pressed', option: opt });

    if (opt === 'support') {
      Alert.alert('support@heysabio.com', '', [{ text: 'OK' }]);
    }

    if (opt === 'newPlan') {
      // Alert.alert('Reset your plan', 'This will remove all existing data & progress reports', [
      //   { text: 'Cancel' },
      //   { text: 'Confirm', onPress: handleResetConfirm },
      // ]);
      Alert.alert('Contact support to reset your plan', '', [{ text: 'Cancel' }]);
    }

    if (opt === 'subscription') {
      // Open apple pay
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

  const handleInfoBoxPress = () => {};

  const ProfileIcon = getIconFromLabel('profile');

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
      </Container>
    </ImageBackground>
  );
};

export default Settings;
