import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Title from '../../../../components/shared/Title';
import SubHeader from '../../../../components/shared/SubHeader';
import { useSelector } from 'react-redux';

const Container = styled.View`
  flex: 1;
  background-color: #16171b;
  padding: 20px;
`;

const Reports = () => {
  const user = useSelector((state) => state.user.user);
  const training_plans = useSelector((state) => state.user.training_plans);
  const training_plan = training_plans.filter((p) => p.status === 'ACTIVE')[0];

  const nextReportIn = moment(training_plan.next_progress_report_at).diff(moment(), 'days');

  return (
    <Container>
      <Title>Your progress reports</Title>
      <SubHeader>{`Your next report is in ${nextReportIn} days`}</SubHeader>
    </Container>
  );

};

export default Reports;
