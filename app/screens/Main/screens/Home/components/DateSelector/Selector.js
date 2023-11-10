import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  position: absolute;
  padding: 9px 4px;
  z-index: -1;
`;
const Inner = styled.View`
  height: 68px;
  background-color: #1f2023;
  border-radius: 12px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: black;
  shadow-offset: 0px 2px;
`;

const Selector = ({ width }) => {
  const containerStyle = { width, transform: [{ translateX: 3 * width }] };

  return (
    <Container style={containerStyle}>
      <Inner />
    </Container>
  );
};

export default React.memo(Selector);
