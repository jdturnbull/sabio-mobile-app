import React from 'react';
import styled from 'styled-components';

const Text = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: 24px;
  color: ${(props) => props.theme.text.colors.white};
  margin-bottom: 30px;
`;

const Title = ({ children, ...props }) => {
  return <Text {...props}>{children}</Text>;
};

export default Title;
