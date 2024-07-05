import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import useActiveRoute from '../../hooks/useActiveRoute';
import BackIcon from '../../assets/icons/24x/Back';
import { useNavigation } from '@react-navigation/native';

const backable_screens = ['CustomGoal', 'SelectEvent', 'AddRace', 'RateAbility'];

const Container = styled(Animated.View)`
  margin-top: ${(props) => props.theme.spacing.safeAreaView};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  padding-horizontal: 20px;
  height: 30px;
`;

const ProgressBarContainer = styled(Animated.View)`
  height: 8px;
  width: 200px;
  border-radius: 5px;
  background-color: #000;
`;

const ProgressBarInner = styled(Animated.View)`
  height: 8px;
  border-radius: 5px;
  background-color: #ee6e12;
`;

const Header = () => {
  const navigation = useNavigation();
  const route = useActiveRoute();
  const progress = useSharedValue(0.1);

  const [canBack, setCanBack] = useState(false);

  useEffect(() => {
    if (backable_screens.includes(route)) {
      setCanBack(true);
    } else {
      setCanBack(false);
    }

    if (route === 'GoalSelect') {
      progress.value = withTiming(0.1, { duration: 300 });
    }
    if (route === 'CustomGoal') {
      progress.value = withTiming(0.2, { duration: 300 });
    }
    if (route === 'SelectEvent') {
      progress.value = withTiming(0.2, { duration: 300 });
    }
  }, [route]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const handleBack = () => navigation.goBack();

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {canBack && (
          <TouchableOpacity onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
        )}
      </View>
      <ProgressBarContainer>
        <ProgressBarInner style={animatedStyle} />
      </ProgressBarContainer>
      <View style={{ flex: 1 }} />
    </Container>
  );
};

export default Header;
