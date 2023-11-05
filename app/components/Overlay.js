import React from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BlackPortal, WhitePortal } from 'react-native-portal';

const OverlayContainer = styled(TouchableWithoutFeedback)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

export const OverlayPortal = () => <WhitePortal name="overlay" />;

const Overlay = ({ onPress, children }) => {
  return (
    <BlackPortal name="overlay">
      <OverlayContainer containerStyle={{ position: 'absolute', width: '100%', height: '100%' }} onPress={onPress}>
        {children}
      </OverlayContainer>
    </BlackPortal>
  );
};

Overlay.defaultProps = { onPress: () => {} };

export default Overlay;
