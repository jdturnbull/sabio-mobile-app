import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getIconFromLabel } from '../utils/icon';
import { useColorScheme } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.splash.background};
`;

const Splash = () => {
  const colorScheme = 'dark';
  const { replace } = useNavigation();
  const { loaded } = useSelector((state) => state.user);

  useEffect(() => {
    if (loaded) setTimeout(() => replace('App'), 1000);
  }, [loaded]);

  const Icon = colorScheme === 'dark' ? getIconFromLabel('splashDark') : getIconFromLabel('splashWhite');
  const Floor =
    colorScheme === 'dark' ? getIconFromLabel('landingMidGraphicDark') : getIconFromLabel('landingMidGraphic');

  // Animation state
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Bounce animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Container>
      <Animated.View style={{ position: 'absolute', bottom: 250, transform: [{ scale: scaleAnim }] }}>
        <Icon />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', bottom: 50 }}>
        <Floor />
      </Animated.View>
    </Container>
  );
};

export default Splash;
