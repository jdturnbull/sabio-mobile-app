import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  height: 2px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #000;
  width: 100%;
`;

const CustomDivider = ({ style }) => {
  return <Container style={style} />;
};

export default CustomDivider;
