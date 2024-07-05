import React from 'react';
import styled from 'styled-components';

const Text = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const SubHeader = ({ children, style }) => {
  return <Text style={style}>{children}</Text>;
};

export default SubHeader;
