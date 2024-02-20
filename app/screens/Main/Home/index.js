import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { ImageBackground, View, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPlan, setup } from '../../../stores/user/userSlice';
import Journey from './components/Journey';
import WaitingScreen from './components/WaitingScreen';
import { getIconFromLabel } from '../../../utils/icon';
import BackgroundDark from '../../../assets/home-background-dark.png';
import BackgroundLight from '../../../assets/home-background-light.png';
import { useMixpanel } from '../../../hooks/useMixpanel';

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
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const user = useSelector((state) => state.user?.session?.user);

  const theme = useTheme();
  const colorScheme = useColorScheme();

  const StreakIcon = getIconFromLabel('streak');

  const intervalRef = useRef(null);

  useEffect(() => {
    identify({ userId: user?.id, email: user?.email, name: user?.name });
    track('SCREEN_VIEW', { screen: 'Home' });
  }, []);

  useEffect(() => {
    if (plannedActivities?.length === 0) {
      intervalRef.current = setInterval(() => {
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
        <Journey />
      </ImageBackground>
    );
  }
};

export default Home;
