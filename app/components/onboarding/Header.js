import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import useActiveRoute from '../../hooks/useActiveRoute';
import BackIcon from '../../assets/icons/24x/Back';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useActiveRoute();
  const progress = useSharedValue(0.1);

  const [canBack, setCanBack] = useState(false);

  // 13 screens (max flow length)
  const increment = 1 / 13;

  useEffect(() => {
    if (route !== 'GoalSelect' && route !== 'CreatingPlan') {
      setCanBack(true);
    } else {
      setCanBack(false);
    }

    if (route === 'GoalSelect') {
      progress.value = withTiming(increment, { duration: 300 });
    }
    if (route === 'GeneralHealth') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
    if (route === 'CustomGoal') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
    if (route === 'WhereTrain') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
    if (route === 'SelectEvent') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
    if (route === 'AddRace') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
    if (route === 'RunDistance') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
    if (route === 'SelectTerrain') {
      progress.value = withTiming(increment * 3, { duration: 300 });
    }
    if (route === 'RateAbility') {
      progress.value = withTiming(increment * 4, { duration: 300 });
    }
    if (route === 'PlanLength') {
      progress.value = withTiming(increment * 5, { duration: 300 });
    }
    if (route === 'WhenTrain') {
      progress.value = withTiming(increment * 6, { duration: 300 });
    }
    if (route === 'LongerActivityDay') {
      progress.value = withTiming(increment * 7, { duration: 300 });
    }
    if (route === 'WhenStart') {
      progress.value = withTiming(increment * 8, { duration: 300 });
    }
    if (route === 'WhichUnits') {
      progress.value = withTiming(increment * 9, { duration: 300 });
    }
    if (route === 'CurrentInjuries') {
      progress.value = withTiming(increment * 10, { duration: 300 });
    }
    if (route === 'ChronicIllness') {
      progress.value = withTiming(increment * 11, { duration: 300 });
    }
    if (route === 'EquipmentFacilities') {
      progress.value = withTiming(increment * 12, { duration: 300 });
    }
    if (route === 'CreatingPlan') {
      progress.value = withTiming(increment * 13, { duration: 300 });
    }
    if (route === 'WeightEntry') {
      progress.value = withTiming(increment * 3, { duration: 300 });
    }
    if (route === 'TriathlonDistance') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
    if (route === 'GeneralFitness') {
      progress.value = withTiming(increment * 2, { duration: 300 });
    }
  }, [route]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const handleBack = () => {
    navigation.goBack();
  };

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
