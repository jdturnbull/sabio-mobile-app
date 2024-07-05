import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Title from '../../components/onboarding/Title';
import CustomDivider from '../../components/onboarding/CustomDivider';
import CustomInput from '../../components/onboarding/CustomInput';
import SubHeader from '../../components/onboarding/SubHeader';
import DateInput from '../../components/onboarding/DateInput';

const Container = styled.View`
  flex: 1;
  padding-horizontal: 20px;
`;

const AddRace = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [date, setDate] = useState(moment.utc().format('YYYY-MM-DD'));

  const handleSubmit = () => navigation.navigate('RateAbility');

  return (
    <Container>
      <Title style={{ marginBottom: 10, marginTop: 10 }}>Add a new race</Title>
      <SubHeader>Enter the race details below</SubHeader>
      <CustomDivider />
      <CustomInput label={'Race name'} placeholder={'The name of your race'} value={name} setValue={setName} />
      <DateInput label={'Race date'} value={date} setValue={setDate} />
    </Container>
  );
};

export default AddRace;
