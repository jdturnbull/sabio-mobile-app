import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dimensions, View } from 'react-native';
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import wave_right from '../../assets/mascot/wave_right.png';
import wave_left from '../../assets/mascot/wave_left.png';
import slight_side_eye from '../../assets/mascot/slight_side_eye.png';
import existing from '../../assets/mascot/existing.png';
import { useDispatch, useSelector } from 'react-redux';
import { continueWithApple } from '../../stores/user/userSlice';
import SubHeader from '../../components/shared/SubHeader';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  padding-top: ${(props) => props.theme.spacing.safeAreaView};
  padding-bottom: ${(props) => props.theme.spacing.safeAreaViewBottom};
  margin-top: 50px;
`;

const SwipeableContainer = styled.View`
  flex: 1;
  height: 80%;
`;

const SwipeableView = styled.View`
  flex: 1;
  width: ${() => `${width}px`};
  align-items: center;
  padding-horizontal: 20px;
`;

const Mascot = styled.Image``;

const Header = styled.Text`
  text-align: center;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.lg};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.lg};
  color: ${(props) => props.theme.text.colors.white};
  margin-bottom: 20px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.white};
  padding: 12px;
  /* width - padding of upper elements */
  width: ${() => `${width - 40}px`};
  border-radius: 12px;
`;

const ButtonLabel = styled.Text`
  text-align: center;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.black};
`;

const Dots = ({ totalScreens, screenNumber }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: totalScreens }).map((_, index) => {
        const animatedWidth = useSharedValue(index === screenNumber ? 40 : 8);

        const animatedStyle = useAnimatedStyle(() => {
          return {
            width: withTiming(animatedWidth.value, { duration: 300 }),
          };
        });

        if (index === screenNumber) {
          animatedWidth.value = 40;
        } else {
          animatedWidth.value = 8;
        }

        return (
          <Animated.View
            key={index}
            style={[
              animatedStyle,
              {
                height: 8,
                borderRadius: 4,
                backgroundColor: index === screenNumber ? '#EE6E12' : '#A1AAD350',
                marginHorizontal: 4,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const Welcome = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const navigation = useNavigation();

  const totalScreens = 4;
  const [screenNumber, setScreenNumber] = useState(0);
  const scrollViewRef = React.useRef(null);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(contentOffsetX / width);
    setScreenNumber(currentPage);
  };

  const handleSignInWithApple = () => {
    dispatch(continueWithApple());
  };

  useEffect(() => {
    if (user) {
      if (user.onboarding_status === 'NOT_STARTED' || user.onboarding_status === 'RESETTING_PLAN') {
        navigation.navigate('GoalSelect');
      } else if (user.onboarding_status === 'COMPLETE') {
        navigation.navigate('Main');
      }
    }
  }, [user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Container>
        <SwipeableContainer>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            <SwipeableView>
              <View style={{ height: '40%', justifyContent: 'center' }}>
                <Mascot source={wave_right} style={{ width: 220, height: 202 }} />
              </View>
              <View style={{ height: '60%', justifyContent: 'center' }}>
                <Header style={{ fontSize: 24 }}>Your new fitness coach</Header>
                <SubHeader style={{ textAlign: 'center' }}>
                  Meet Sabio, your fitness coach powered by artificial intelligence
                </SubHeader>
              </View>
            </SwipeableView>
            <SwipeableView>
              <View style={{ height: '40%', justifyContent: 'center' }}>
                <Mascot source={existing} style={{ width: 220, height: 202 }} />
              </View>
              <View style={{ height: '60%', justifyContent: 'center' }}>
                <Header style={{ fontSize: 24 }}>Completely focused on you</Header>
                <SubHeader style={{ textAlign: 'center' }}>
                  Adaptable to injuries, preferences, illness and schedule limitations
                </SubHeader>
              </View>
            </SwipeableView>
            <SwipeableView>
              <View style={{ height: '40%', justifyContent: 'center' }}>
                <Mascot source={wave_left} style={{ width: 230, height: 202 }} />
              </View>
              <View style={{ height: '60%', justifyContent: 'center' }}>
                <Header style={{ fontSize: 24 }}>Guided by your Strava</Header>
                <SubHeader style={{ textAlign: 'center' }}>
                  Enrich Sabio with your data by connecting with Strava
                </SubHeader>
              </View>
            </SwipeableView>
            <SwipeableView>
              <View style={{ height: '40%', justifyContent: 'center' }}>
                <Mascot source={slight_side_eye} style={{ width: 220, height: 202 }} />
              </View>
              <View style={{ height: '60%', justifyContent: 'center' }}>
                <Header style={{ fontSize: 24 }}>Free to use</Header>
                <SubHeader style={{ textAlign: 'center' }}>
                  Our mission is to make intelligent coaching available to everyone
                </SubHeader>
              </View>
            </SwipeableView>
          </ScrollView>
        </SwipeableContainer>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '20%',
          }}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <Dots screenNumber={screenNumber} totalScreens={totalScreens} />
          </View>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Button onPress={handleSignInWithApple}>
              <ButtonLabel>Get Started</ButtonLabel>
            </Button>
          </View>
        </View>
      </Container>
    </GestureHandlerRootView>
  );
};

export default Welcome;
