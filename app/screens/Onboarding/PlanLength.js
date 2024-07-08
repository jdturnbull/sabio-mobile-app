import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import { useSelector } from 'react-redux';
import PlanLengthSelectionBox from '../../components/onboarding/PlanLengthSelectionBox';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const OptionsContainer = styled.View`
  margin-top: 30px;
`;

const PlanLength = () => {
  const user = useSelector((state) => state.user);
  const [selected, setSelected] = useState('20 Weeks');

  const today = moment.tz(user.timezone);

  const OPTIONS = [
    {
      label: '14 Weeks',
      endDate: today.clone().add(14, 'weeks').format('DD MMM YYYY'),
    },
    {
      label: '16 Weeks',
      endDate: today.clone().add(16, 'weeks').format('DD MMM YYYY'),
    },
    {
      label: '20 Weeks',
      endDate: today.clone().add(16, 'weeks').format('DD MMM YYYY'),
    },
    {
      label: 'Custom Plan Length',
      subLabel: 'Select any number of weeks',
    },
    { label: 'Custom End Date', subLabel: 'Select any end date' },
  ];

  return (
    <Container>
      <Title style={{ marginBottom: 10 }}>How long do you want your plan to be?</Title>
      <SubHeader>Choose how long you'd to train for (you can change this later)</SubHeader>
      <OptionsContainer>
        {OPTIONS.map((opt) => (
          <PlanLengthSelectionBox
            key={opt.label}
            item={opt}
            selected={opt.label === selected}
            setSelected={setSelected}
          />
        ))}
      </OptionsContainer>
    </Container>
  );
};

export default PlanLength;
