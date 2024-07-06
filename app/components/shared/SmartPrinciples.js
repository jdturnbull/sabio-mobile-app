import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
`;

const Header = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
  margin-bottom: 20px;
`;

const HighlightedHeader = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.highlight};
`;

const Body = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.text.colors.white};
  margin-bottom: 30px;
`;

const SmartPrinciples = () => {
  return (
    <Container>
      <Header>
        <HighlightedHeader>S</HighlightedHeader>pecific
      </Header>
      <Body>Move away from general, ambiguous goal planning to more clearly defined, direct goals</Body>
      <Header>
        <HighlightedHeader>M</HighlightedHeader>easurable
      </Header>
      <Body>The goal must include some quantifiable aspect, for example completing a certain distance</Body>
      <Header>
        <HighlightedHeader>A</HighlightedHeader>chievable
      </Header>
      <Body>To be functional and motivating, goals need to be achievable</Body>
      <Header>
        <HighlightedHeader>R</HighlightedHeader>elevant
      </Header>
      <Body>Your goals should make sense to you at this time in your life</Body>
      <Header>
        <HighlightedHeader>T</HighlightedHeader>ime
      </Header>
      <Body>Set a specific timeframe in which to pursue and complete your goal</Body>
    </Container>
  );
};

export default SmartPrinciples;
