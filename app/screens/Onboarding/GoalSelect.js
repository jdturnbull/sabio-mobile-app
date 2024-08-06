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
import { useDispatch, useSelector } from 'react-redux';
import { clearState, updateState } from '../../stores/onboarding/onboardingSlice';
import SubHeader from '../../components/shared/SubHeader';

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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const state = useSelector((state) => state.onboarding);

  const handlePress = (option) => {
    dispatch(clearState());

    if (option === 'race_an_event') {
      navigation.navigate('SelectEvent');
    }
    if (option === 'custom_goal') {
      navigation.navigate('CustomGoal');
    }
    if (option === 'run_set_distance') {
      navigation.navigate('RunDistance');
    }
    if (option === 'improve_general_health') {
      navigation.navigate('GeneralHealth');
    }
    if (option === 'run_first_5k') {
      dispatch(updateState({ profile: { ...state.profile, ability: 'Beginner' } }));
      navigation.navigate('PlanLength');
    }
    if (option === 'lose_weight') {
      navigation.navigate('WhereTrain');
    }
    if (option === 'train_for_a_triathlon') {
      navigation.navigate('TriathlonDistance');
    }
    if (option === 'general_fitness') {
      navigation.navigate('GeneralFitness');
    }
  };

  return (
    <Container>
      <Title>What do you want to achieve?</Title>
      <SubHeader style={{ marginBottom: 20 }}>Select an option or enter a custom goal</SubHeader>
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
