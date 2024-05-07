import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ImageBackground, View, useColorScheme } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { useDispatch, useSelector } from 'react-redux';
import { FloatingAction } from 'react-native-floating-action';
import { getPlan } from '../../../stores/user/userSlice';
import Journey from './components/Journey';
import WaitingScreen from './components/WaitingScreen';
import { getIconFromLabel } from '../../../utils/icon';
import BackgroundDark from '../../../assets/home-background-dark.png';
import BackgroundLight from '../../../assets/home-background-light.png';
import { useMixpanel } from '../../../hooks/useMixpanel';
import ActionModal from './components/Journey/components/ActionModal';
import call from '../../../utils/call';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HelloContainer = styled.View`
  margin-top: 5px;
  margin-bottom: 10px;
  padding-horizontal: 20px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const HelloText = styled.Text`
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const ItemContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ItemText = styled.Text`
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  margin-left: 5px;
`;

const Home = () => {
  const dispatch = useDispatch();
  const { track, identify } = useMixpanel();
  const [hideButton, setHideButton] = useState(false);
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const user = useSelector((state) => state.user?.session?.user);

  const theme = useTheme();
  const colorScheme = useColorScheme();

  const StreakIcon = getIconFromLabel('streak');

  const intervalRef = useRef(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    const run = async () => {
      const token = await AsyncStorage.getItem('deviceToken');

      if (token) {
        await call('POST', 'users/update', {
          userId: user.id,
          data: { deviceToken: token },
        });
      }
    };

    run();
  }, []);

  useEffect(() => {
    PushNotification.requestPermissions().then(async (event) => {
      await call('POST', 'users/update', {
        userId: user.id,
        data: { notificationsEnabled: event.alert },
      });
    });
  }, []);

  useEffect(() => {
    if (user) {
      identify({ userId: user?.id, email: user?.email, name: user?.name });
      track('SCREEN_VIEW', { screen: 'Home' });
    }
  }, [user]);

  useEffect(() => {
    dispatch(getPlan());

    if (!plannedActivities?.length || plannedActivities?.length === 0) {
      intervalRef.current = setInterval(() => {
        console.log('Interval run...');
        dispatch(getPlan());
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (plannedActivities?.length > 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [plannedActivities?.length]);

  const actions = [
    {
      text: 'Replan day',
      color: theme.home.cards.rightBackground,
      textBackground: theme.home.cards.rightBackground,
      textColor: theme.text.colors.secondary,
      icon: require('../../../assets/replan.png'),
      name: 'replan_day',
      position: 1,
    },
    {
      text: 'Replan week',
      color: theme.home.cards.rightBackground,
      textBackground: theme.home.cards.rightBackground,
      textColor: theme.text.colors.secondary,
      icon: require('../../../assets/replan.png'),
      name: 'replan_week',
      position: 2,
    },
    {
      text: 'Feedback',
      color: theme.home.cards.rightBackground,
      textBackground: theme.home.cards.rightBackground,
      textColor: theme.text.colors.secondary,
      icon: require('../../../assets/replan.png'),
      name: 'feedback',
      position: 3,
    },
  ];

  if (!plannedActivities || plannedActivities?.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <WaitingScreen />
      </View>
    );
  } else {
    return (
      <ImageBackground
        source={colorScheme === 'light' ? BackgroundLight : BackgroundDark}
        resizeMode="cover"
        style={{
          flex: 1,
          backgroundColor: colorScheme === 'light' ? theme.colors.white : theme.colors.darkBrown,
          paddingTop: 50,
        }}>
        {/* <Header /> */}
        <HelloContainer>
          <HelloText>
            Hi, <HelloText style={{ color: theme.text.colors.primary }}>{user?.name.split(' ')[0]}!</HelloText>
          </HelloText>
          <ItemContainer>
            <StreakIcon color={colorScheme === 'dark' ? theme.colors.white : null} />
            <ItemText>{user?.streak || 0}</ItemText>
          </ItemContainer>
        </HelloContainer>
        <Journey setHideButton={setHideButton} />
        {!hideButton && (
          <FloatingAction
            actions={actions}
            // floatingIcon={SabioLogo}
            color={theme.colors.primary}
            overlayColor="rgba(0, 0, 0, 0.5)"
            onPressItem={(name) => {
              setSelectedAction(name);
              setModalVisible(true);
            }}
          />
        )}

        <ActionModal action={selectedAction} visible={isModalVisible} setVisible={setModalVisible} />
      </ImageBackground>
    );
  }
};

export default Home;

// TODO: Clean up UI for action modal & loading
// TODO: Add change rest days option in settings
// TODO: Add learnings to replan day and replan week
