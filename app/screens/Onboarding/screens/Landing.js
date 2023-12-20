import React, { useEffect, useRef } from 'react';
import { Animated, useWindowDimensions, View, Pressable, Appearance, StatusBar } from 'react-native';
import styled, { useTheme } from 'styled-components';
import { useDispatch } from 'react-redux';
import { continueWithApple } from '../../../stores/user/userSlice';
import { getIconFromLabel } from '../../../utils/icon';

const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  padding-top: ${(props) => props.theme.spacing.safeAreaView};
  width: 100%;
  height: 75%;
  align-items: center;
  padding-horizontal: 15%;
  background-color: ${(props) => props.theme.colors.background1};
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

const BodyText = styled.Text`
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  margin-bottom: 20px;
`;

const Bottom = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.white};
  align-items: center;
`;

const GetStartedButton = styled.View`
  background-color: ${(props) => props.theme.colors.primary};
  margin-top: 65px;
  border-radius: 18px;
  padding: 24px;
  align-items: center;
  justify-content: center;
`;

const GetStartedText = styled.Text`
  color: ${(props) => props.theme.text.colors.secondaryInverse};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const AlreadyHaveAccountButton = styled.View`
  margin-top: 15px;
  align-items: center;
  justify-content: center;
`;

const AlreadyHaveAccountText = styled.Text`
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const Landing = () => {
  const colorScheme = Appearance.getColorScheme();

  const theme = useTheme();
  const dispatch = useDispatch();
  const width = useWindowDimensions().width;

  const Logo = getIconFromLabel('logoLarge');
  const Hero = getIconFromLabel('landingRunner');

  const Graphic =
    colorScheme === 'light' ? getIconFromLabel('landingMidGraphic') : getIconFromLabel('landingMidGraphicDark');

  const opacity = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    dispatch(continueWithApple());
  };

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Container>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Content>
        <Logo />
        <Headline>
          Welcome to <Headline style={{ color: theme.text.colors.primary }}>Sabio</Headline>
        </Headline>
        <BodyText>To get started we need to learn a little about you.</BodyText>
        <BodyText>Set aside 5 minutes to chat with Sabio about your needs and goals.</BodyText>
      </Content>
      <Bottom style={colorScheme === 'dark' && { backgroundColor: theme.colors.black }}>
        <Pressable onPress={handlePress}>
          <GetStartedButton>
            <GetStartedText>Get started with Sabio</GetStartedText>
          </GetStartedButton>
        </Pressable>
        <Pressable onPress={handlePress}>
          <AlreadyHaveAccountButton>
            <AlreadyHaveAccountText style={colorScheme === 'dark' ? { color: '#fff' } : {}}>
              Already have an account?{' '}
              <AlreadyHaveAccountText style={{ color: theme.colors.primary, fontWeight: theme.text.weight.bold }}>
                Sign in
              </AlreadyHaveAccountText>
            </AlreadyHaveAccountText>
          </AlreadyHaveAccountButton>
        </Pressable>
      </Bottom>
      <View
        style={{
          position: 'absolute',
          top: '42%',
          left: width / 2 - 151,
          zIndex: 2,
        }}>
        <Hero />
      </View>
      <View style={{ position: 'absolute', top: '65%', left: 0, zIndex: 1 }}>
        <Graphic />
      </View>
    </Container>
  );
};

export default Landing;
