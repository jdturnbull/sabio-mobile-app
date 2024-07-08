import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Slider from '@react-native-community/slider';

const Container = styled.View`
  width: 100%;
  height: 60px;
  justify-content: center;
`;

const CustomSlider = ({ value, setValue, min, max, step }) => {
  return (
    <Slider
      style={{ width: 200, height: 40 }}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
    />
  );
};

export default CustomSlider;
