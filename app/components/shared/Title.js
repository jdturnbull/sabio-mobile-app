import React from 'react';
import styled from 'styled-components';

const Text = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.lg};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.lg};
  color: ${(props) => props.theme.text.colors.white};
  margin-bottom: 10px;
`;

const Title = ({ children, ...props }) => {
  return <Text {...props}>{children}</Text>;
};

export default Title;
