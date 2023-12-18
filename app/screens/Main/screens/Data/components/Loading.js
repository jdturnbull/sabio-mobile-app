import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import styled, { useTheme } from 'styled-components';

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

const Loading = () => {
  const theme = useTheme();

  return (
    <Container>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.text.colors.highlight} style={{ marginRight: 10 }} />
        <StyledText>Fetching your progress</StyledText>
      </View>
    </Container>
  );
};

export default Loading;
