import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScrollView, RefreshControl, View } from 'react-native';
import moment from 'moment';
import Title from '../../../../components/shared/Title';
import { useSelector } from 'react-redux';
import call from '../../../../utils/call';
import Report from '../components/Report';
import BodyText from '../../../../components/shared/BodyText';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding: 20px;
`;

const Reports = () => {
  const user = useSelector((state) => state.user.user);
  const training_plans = useSelector((state) => state.user.training_plans);
  const training_plan = training_plans.filter((p) => p.status === 'ACTIVE')[0];

  const nextReportIn = moment(training_plan.next_progress_report_at).diff(moment(), 'days');

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const response = await call('GET', `users/progressReports/${training_plan.id}`);
    const sortedReports = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setReports(sortedReports);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);


  return (
    <Container
      refreshControl={
        <RefreshControl tintColor={'#f8f8f8'} refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Title style={{ marginBottom: 20 }}>Your progress reports</Title>
      {!loading && reports?.length === 0 && (
        <View style={{ flex: 1, height: 500, justifyContent: 'center', alignItems: 'center' }}>
          <BodyText style={{ color: '#f8f8f890' }}>Your first report will appear in {nextReportIn} days</BodyText>
        </View>
      )}
      {reports && reports.map((report) => <Report key={report.id} report={report} />)}
    </Container>
  );
};

export default Reports;
