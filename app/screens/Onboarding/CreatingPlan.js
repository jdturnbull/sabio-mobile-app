import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Image, Animated, Easing } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { save } from '../../stores/onboarding/onboardingSlice';
import { setup } from '../../stores/user/userSlice';
import mascot from '../../assets/mascot/wave_right.png';
import { useNavigation } from '@react-navigation/native';
import call from '../../utils/call';
import SubHeader from '../../components/shared/SubHeader';

const guidance = [
  'Connect Strava to enhance Sabio',
  'Notifications help you stay consistent',
  'Adjust your profile to further personalise your plan on the go',
  'Chat with Sabio for additional guidance',
  'Reorganise your week with a simple drag and drop',
  'Complete weekly checkins to let Sabio know if anything needs changing',
  "Like other's activities to give them a motivational boost!",
  "Check out the plan overview to see what you'll be doing during your training",
  "Create multiple plans and switch between them with a press of a button",
  "Injured? Sabio can assign physio to help you recover"
];

const Container = styled.View`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PercentageLabel = styled(Animated.Text)`
  font-size: 20px;
  color: ${(props) => props.theme.text.colors.white};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xl};
  font-weight: ${(props) => props.theme.text.weight.bold};
  margin-top: 40px;
`;

const ProgressBarContainer = styled.View`
  width: 60%;
  height: 8px;
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  border-radius: 10px;
  overflow: hidden;
  margin-top: 40px;
`;

const ProgressBarInner = styled(Animated.View)`
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 10px;
`;

const GuidanceContainer = styled.View`
  margin-top: 10px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GuidanceText = styled(Animated.Text)`
  color: ${(props) => props.theme.text.colors.white};
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-size: ${(props) => props.theme.text.size.md};
  text-align: center;
`;

const CreatingPlan = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.onboarding);
  const user_state = useSelector((state) => state.user);
  const profile = useSelector((state) => state.user.profile);

  const navigation = useNavigation();

  const intervalRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [guidanceIndex, setGuidanceIndex] = useState(0);
  const [initialDelayPassed, setInitialDelayPassed] = useState(false);
  const guidanceOpacity = useRef(new Animated.Value(0)).current; // Start with opacity 0

  const [generatedWeek, setGeneratedWeek] = useState(user_state?.user?.onboarding_generated_week);

  const [stage, setStage] = useState('NOT_STARTED');

  // Checks to see if it should send data to backend
  useEffect(() => {
    if (state.profile) {
      const status = user_state?.user?.onboarding_status;
      if (status === 'NOT_STARTED' || status === 'RESETTING_PLAN') {
        dispatch(save({ state, user: user_state.user, notification_settings: state.notification_settings }));
      }
    }
  }, []);

  useEffect(() => {
    if (profile) {
      navigation.navigate('Main', { screen: 'Plan', params: { screen: 'Slider' } });
    }
  }, [profile])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let updatedUser = await call('GET', `users/${user_state.user.id}`);
        setGeneratedWeek(updatedUser?.onboarding_generated_week);
        setStage(updatedUser?.onboarding_status);

        if (updatedUser?.onboarding_status !== 'COMPLETE') {
          intervalRef.current = setInterval(async () => {
            updatedUser = await call('GET', `users/${user_state.user.id}`);
            setStage(updatedUser?.onboarding_status);
            setGeneratedWeek(updatedUser?.onboarding_generated_week);
            if (updatedUser?.onboarding_status === 'COMPLETE') {
              clearInterval(intervalRef.current);
              dispatch(setup('CreatingPlan'));
            }
          }, 5000);
        } else {
          dispatch(setup('CreatingPlan'));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let progressValue = 0;
    switch (stage) {
      case 'NOT_STARTED':
        progressValue = 0;
        break;
      case 'RESETTING_PLAN':
        progressValue = 0;
        break;
      case 'GENERATING_REHAB_PLAN':
        progressValue = 0;
        break;
      case 'ANALYSING_DATA':
        progressValue = 25;
        break;
      case 'GENERATED_HOLISTIC':
        progressValue = 50;
        break;
      case 'GENERATED_ACTIVITIES':
        progressValue = 75;
        break;
      case 'COMPLETE':
        progressValue = 100;
        break;
      default:
        progressValue = 0;
    }
    Animated.timing(progress, {
      toValue: progressValue,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [stage]);

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setInitialDelayPassed(true);
      Animated.timing(guidanceOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (!initialDelayPassed) return;

    const interval = setInterval(() => {
      Animated.timing(guidanceOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setGuidanceIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % guidance.length;
          Animated.timing(guidanceOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
          return nextIndex;
        });
      });
    }, 7000); // Change guidance text every 10 seconds

    return () => clearInterval(interval);
  }, [initialDelayPassed]);

  const animatedStyle = {
    width: progress.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  };

  const guidanceAnimatedStyle = {
    opacity: guidanceOpacity,
  };

  return (
    <Container>
      <Image source={mascot} style={{ width: 220, height: 202 }} />
      <PercentageLabel>Building your plan</PercentageLabel>
      <SubHeader style={{ marginTop: 10 }}>{!generatedWeek ? `This may take a few minutes` : `Finished planning week ${generatedWeek}`}</SubHeader>
      <ProgressBarContainer>
        <ProgressBarInner style={animatedStyle} />
      </ProgressBarContainer>
      <GuidanceContainer>
        {initialDelayPassed && <GuidanceText style={guidanceAnimatedStyle}>{guidance[guidanceIndex]}</GuidanceText>}
      </GuidanceContainer>
    </Container>
  );
};

export default CreatingPlan;
