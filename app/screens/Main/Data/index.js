import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import call from '../../../utils/call';
import Loading from './components/Loading';
import NoReports from './components/NoReports';
import ReportsList from './components/ReportsList';
import { useMixpanel } from '../../../hooks/useMixpanel';

const Container = styled.View`
  flex: 1;
  padding-horizontal: 20px;
  background-color: ${(props) => props.theme.colors.settingsBackground};
`;

const HelloContainer = styled.View`
  margin-top: ${(props) => props.theme.spacing.safeAreaView};
  margin-bottom: 40px;
`;

const HelloText = styled.Text`
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const Data = () => {
  const theme = useTheme();
  const focused = useIsFocused();

  const { track } = useMixpanel();

  const user = useSelector((state) => state.user.session?.user);

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const response = await call('GET', `users/getProgressReports/${user?.id}`);
      setReports(response);
      setLoading(false);
    };

    if (focused) {
      track('SCREEN_VIEW', { screen: 'Data' });
      fetchReports();
    }
  }, [focused]);

  return (
    <Container>
      <HelloContainer>
        <HelloText>
          My <HelloText style={{ color: theme.colors.primary }}>Progress</HelloText>
        </HelloText>
      </HelloContainer>
      {loading && <Loading />}
      {!loading && reports.length === 0 ? <NoReports /> : null}
      {reports.length > 0 ? <ReportsList reports={reports} /> : null}
    </Container>
  );
};

export default Data;
