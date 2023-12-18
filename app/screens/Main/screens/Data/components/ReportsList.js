import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import ProgressReport from './ProgressReport';

const ReportsList = ({ reports }) => {
  return (
    <ScrollView style={{ marginBottom: 20 }}>
      {reports.map((report, index) => {
        return <ProgressReport key={index} report={report} />;
      })}
    </ScrollView>
  );
};

export default ReportsList;
