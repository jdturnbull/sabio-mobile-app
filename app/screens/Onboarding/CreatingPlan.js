import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { View, Text } from 'react-native';

const Container = styled.View`
  padding: 20px;
`;

const KeyValueContainer = styled.View`
  margin-bottom: 10px;
`;

const KeyText = styled.Text`
  font-weight: bold;
  color: #ee6e12;
`;

const ValueText = styled.Text`
  margin-left: 10px;
  color: white;
`;

const CreatingPlan = () => {
  const state = useSelector((state) => state.onboarding);

  const renderKeyValue = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <KeyValueContainer key={key}>
          <KeyText>{key}:</KeyText>
          <ValueText>{JSON.stringify(value)}</ValueText>
        </KeyValueContainer>
      );
    } else {
      return (
        <KeyValueContainer key={key}>
          <KeyText>{key}:</KeyText>
          <ValueText>{value.toString()}</ValueText>
        </KeyValueContainer>
      );
    }
  };

  return <Container>{Object.entries(state).map(([key, value]) => renderKeyValue(key, value))}</Container>;
};

export default CreatingPlan;
