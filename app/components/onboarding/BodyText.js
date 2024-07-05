import React from 'react';
import styled from 'styled-components';

const Text = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.text.colors.white};
`;

const BodyText = ({ children, style }) => {
  return <Text style={style}>{children}</Text>;
};

export default BodyText;
