import React from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import Title from '../../components/shared/Title';
import RaceEventOption from '../../components/onboarding/RaceEventOption';
import CustomGoalOption from '../../components/onboarding/CustomGoalOption';
import GoalOption from '../../components/onboarding/GoalOption';

import Measure from '../../assets/icons/18x/Measure';
import Run from '../../assets/icons/18x/Run';
import Health from '../../assets/icons/18x/Health';
import Repeat from '../../assets/icons/18x/Repeat';
import Triathlon from '../../assets/icons/18x/Triathlon';
import { useNavigation } from '@react-navigation/native';
import CustomDivider from '../../components/shared/CustomDivider';

const OPTIONS_LIST = [
  { label: 'Run a set distance', id: 'run_set_distance', Icon: Measure },
  { label: 'Run your first 5k', id: 'run_first_5k', Icon: Run },
  { label: 'Improve general health', id: 'improve_general_health', Icon: Health },
  { label: 'Lose weight', id: 'lose_weight', Icon: Repeat },
  { label: 'Train for a triathlon', id: 'train_for_a_triathlon', Icon: Triathlon },
  { label: 'General fitness', id: 'general_fitness', Icon: Run },
];

const Container = styled.View`
  flex: 1;
  padding-horizontal: 20px;
`;

const GoalSelect = () => {
  const navigation = useNavigation();

  const handlePress = (option) => {
    if (option === 'race_an_event') {
      navigation.navigate('SelectEvent');
    }
    if (option === 'custom_goal') {
      navigation.navigate('CustomGoal');
    }
  };

  return (
    <Container>
      <Title>What is your goal?</Title>
      <ScrollView>
        <RaceEventOption onPress={handlePress} />
        <CustomGoalOption onPress={handlePress} />
        <CustomDivider />
        {OPTIONS_LIST.map((option) => (
          <GoalOption key={option.id} option={option} onPress={handlePress} />
        ))}
      </ScrollView>
    </Container>
  );
};

export default GoalSelect;
