import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScrollView, RefreshControl, View, Image } from 'react-native';
import moment from 'moment';
import { useSelector } from 'react-redux';
import call from '../../../../utils/call';
import Report from '../components/Report';
import mascot from '../../../../assets/mascot/slight_side_eye.png';
import BodyText from '../../../../components/shared/BodyText';
import { useIsFocused } from '@react-navigation/native';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding: 20px;
`;

const Reports = () => {
  const training_plans = useSelector((state) => state.user.training_plans);
  const training_plan = training_plans.filter((p) => p.status === 'ACTIVE')[0];

  const nextReportIn = moment(training_plan.next_progress_report_at).diff(moment(), 'days');

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    setRefreshing(true);
    const response = await call('GET', `users/progressReports/${training_plan.id}`);
    const sortedReports = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setReports(sortedReports);
    setLoading(false);
    setRefreshing(false);
  };


  useEffect(() => {
    if (isFocused) {
      fetchReports();
    }
  }, [isFocused]);

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
      {!loading && reports?.length === 0 && (
        <View style={{ flex: 1, height: 500, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={mascot} style={{ width: 123.2, height: 113.12 }} />
          <BodyText style={{ marginTop: 40, fontWeight: 600 }}>Your first report will appear in {nextReportIn} days</BodyText>
          <BodyText style={{ color: '#f8f8f890', fontWeight: 600, marginTop: 5 }}>Sabio is expecting good things 👀</BodyText>
        </View>
      )}
      {reports && reports.map((report) => <Report key={report.id} report={report} />)}
    </Container>
  );
};

export default Reports;
