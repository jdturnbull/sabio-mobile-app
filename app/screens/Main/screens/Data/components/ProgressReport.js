import React from 'react';
import { View } from 'react-native';
import Styled from 'styled-components';
import ChartComponent from './Chart';

const Container = Styled.View`
    flex: 1;
    width: 100%;
    height: 100%;
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

  return (
    <Container>
      <ChartComponent data={report.analysis.distances} maxVal={distanceMax} label={distanceLabel} YAxisLabel={'km'} />
      <View style={{ height: 40 }} />
      <ChartComponent data={report.analysis.durations} maxVal={durationMax} label={durationLabel} YAxisLabel={'hrs'} />
    </Container>
  );
};

export default ProgressReport;
