import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import ChartComponent from './Chart';

const Container = styled.View`
  flex: 1;
  justify-content: space-evenly;
  margin-bottom: 50px;
`;

const Header = styled.View`
  margin-bottom: 50px;
`;

const HeaderText = styled.Text`
  font-size: 16px;
  font-weight: ${(props) => props.theme.text.weight.bold};
  color: ${(props) => props.theme.colors.progressReportTopText};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
`;

const ProgressReport = ({ report }) => {
  const distanceLabel = `Distance: ${report.analysis.distance}km`;
  const durationLabel = `Duration: ${report.analysis.duration}hrs`;

  let distanceMax = 0;
  let durationMax = 0;

  report.analysis.distances.forEach((distance) => {
    if (distance.value > distanceMax) {
      distanceMax = distance.value;
    }
  });

  report.analysis.durations.forEach((duration) => {
    if (duration.value > durationMax) {
      durationMax = duration.value;
    }
  });

  distanceMax = Math.ceil(distanceMax);
  durationMax = Math.ceil(durationMax);

  durationMax = durationMax >= 2 ? durationMax : 2;
  distanceMax = distanceMax >= 10 ? distanceMax : 10;

  return (
    <Container>
      <Header>
        <HeaderText>{report.title}</HeaderText>
      </Header>
      <ChartComponent
        data={report.analysis.distances}
        maxVal={distanceMax}
        label={distanceLabel}
        YAxisLabel={'km'}
        fromDate={report.fromDate}
        toDate={report.toDate}
      />
      <View style={{ height: 40 }} />
      <ChartComponent
        data={report.analysis.durations}
        maxVal={durationMax}
        label={durationLabel}
        YAxisLabel={'hrs'}
        fromDate={report.fromDate}
        toDate={report.toDate}
      />
    </Container>
  );
};

export default ProgressReport;
