import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { getIconFromLabel } from '../../../../../utils/icon';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.text.colors.highlight};
  font-family: ${(props) => props.theme.text.family};
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const NoReports = () => {
  const Icon = getIconFromLabel('sabioGreyed');

  return (
    <Container>
      <Icon />
      <View
        style={{ width: '100%', marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <StyledText>Sabio hasn't made a report for you yet</StyledText>
      </View>
    </Container>
  );
};

export default NoReports;
