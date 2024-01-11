import React, { useEffect, useState } from 'react';
import { Animated, View, StyleSheet, ActivityIndicator, Text, useColorScheme } from 'react-native';
import { getIconFromLabel } from '../../../../../utils/icon';
import styled, { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';

const Title = styled.Text`
  font-size: 20px;
  margin-top: 60px;
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const SubTitle = styled.Text`
  font-size: 12px;
  margin-top: 10px;
  color: ${(props) => props.theme.waitingScreen.smallText};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const WaitingScreen = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const Logo = getIconFromLabel('logoMedium');
  const WaitingIcon = getIconFromLabel(colorScheme === 'light' ? 'waitingLight' : 'waitingDark');

  const [fadeAnim] = useState(new Animated.Value(1));
  const [widthAnim] = useState(new Animated.Value(0));

  const user = useSelector((state) => state.user?.session?.user);
  const stage = user?.onboardingData?.stage || 0;

  let label = '';

  if (!stage) label = 'Analysing your conversation';
  if (stage === 1) label = 'Forming holistic strategy';
  if (stage === 2) label = 'Forming monthly focuses';
  if (stage === 3) label = 'Forming weekly focuses';
  if (stage === 4) label = 'Planning your first two weeks';
  if (stage === 5) label = 'Plan creation complete';

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: (308 / 5) * stage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [widthAnim, stage]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.waitingScreen.background, paddingTop: 120 }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Logo />
        <Title>Building your initial training plan</Title>
        <SubTitle>This may take a few minutes</SubTitle>
        <WaitingIcon />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <ActivityIndicator style={{ marginRight: 15 }} />
          <Animated.Text style={[styles.pulseText, { opacity: fadeAnim }, { color: theme.text.colors.secondary }]}>
            {label || ''}
          </Animated.Text>
        </View>
        <View
          style={{
            borderColor: theme.colors.primary,
            borderWidth: 2,
            width: 310,
            height: 10,
            borderRadius: 10,
            marginTop: 20,
          }}>
          <Animated.View
            style={{
              width: widthAnim,
              height: 6,
              backgroundColor: theme.colors.primary,
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default WaitingScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 15,
  },
  pulseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
