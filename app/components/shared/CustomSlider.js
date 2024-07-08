import React from 'react';
import styled from 'styled-components';
import Slider from '@react-native-community/slider';

const Container = styled.View`
  width: 100%;
  height: 60px;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const LabelText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.sm};
`;

const CustomSlider = ({ value, setValue, min, max, label, style }) => {
  return (
    <Container style={style}>
      <LabelText>{`${value} ${label || ''}`}</LabelText>
      <Slider
        value={value}
        onValueChange={setValue}
        minimumValue={min}
        tapToSeek={true}
        maximumValue={max}
        step={1}
        minimumTrackTintColor="#A1AAD3"
        thumbTintColor={'#A1AAD3'}
        maximumTrackTintColor="#A1AAD315"
      />
    </Container>
  );
};

export default CustomSlider;
