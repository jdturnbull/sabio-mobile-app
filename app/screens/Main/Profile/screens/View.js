import React from 'react';
import styled from 'styled-components';
import SubHeader from '../../../../components/shared/SubHeader';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import OptionBox from '../components/OptionBox';
import { useNavigation } from '@react-navigation/native';
import Title from '../../../../components/shared/Title';

const navigationMap = {
  'Equipment and facilities': 'EquipmentAndFacilities',
  'Current ability': 'PastExperience',
  'Injuries': 'Injuries',
  'Medications': 'Medications',
  'Chronic conditions': 'ChronicIllness',
  'Training preferences': 'Preferences',
  'Training schedules': 'Schedules',
};

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 20px;
`;

const View = () => {
  const navigation = useNavigation();

  const handlePress = (label) => {
    const route = navigationMap[label];
    if (route) {
      navigation.navigate(route);
    }
  };


  return (
    <Container>
      <Title>Profile Information</Title>
      <SubHeader>Update information to customise your plan</SubHeader>
      <OptionsContainer>
        <OptionBox label={'Equipment and facilities'} onPress={handlePress} value={''} />
        <OptionBox label={'Current ability'} onPress={handlePress} value={''} />
        <OptionBox label={'Injuries'} onPress={handlePress} value={''} />
        <OptionBox label={'Medications'} onPress={handlePress} value={''} />
        <OptionBox label={'Chronic conditions'} onPress={handlePress} value={''} />
        <OptionBox label={'Training preferences'} onPress={handlePress} value={''} />
        <OptionBox label={'Training schedules'} onPress={handlePress} value={''} />
      </OptionsContainer>
    </Container>
  );
};

export default View;
