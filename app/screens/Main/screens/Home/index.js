import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { ImageBackground, View, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPlan, setup } from '../../../../stores/user/userSlice';
import WaitingScreen from './components/WaitingScreen';
import Header from './components/Header';
import Journey from './components/Journey';
import BackgroundLight from '../../../../assets/home-background-light.png';
import BackgroundDark from '../../../../assets/home-background-dark.png';
import { useIsFocused } from '@react-navigation/native';

const HelloContainer = styled.View`
  margin-top: 5px;
  margin-bottom: 10px;
  padding-horizontal: 20px;
`;

const HelloText = styled.Text`
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const Home = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const user = useSelector((state) => state.user.session.user);

  const theme = useTheme();
  const colorScheme = useColorScheme();

  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPlans = () => {
      dispatch(getPlan());
      dispatch(setup());
    };

    fetchPlans();

    if (plannedActivities?.length === 0) {
      intervalRef.current = setInterval(() => {
        fetchPlans();
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isFocused]);

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
        style={{ flex: 1, backgroundColor: colorScheme === 'light' ? theme.colors.white : theme.colors.darkBrown }}>
        <Header />
        <HelloContainer>
          <HelloText>
            Hi, <HelloText style={{ color: theme.text.colors.primary }}>{user.name.split(' ')[0]}!</HelloText>
          </HelloText>
        </HelloContainer>
        <Journey />
      </ImageBackground>
    );
  }
};

export default Home;
