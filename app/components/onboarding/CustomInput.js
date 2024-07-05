import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.View`
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  border: ${(props) => `1px solid ${props.theme.colors.borderHighlight}`};
  padding: 10px;
  border-radius: 8px;
  height: 70px;
  margin-bottom: 10px;
`;

const Label = styled.Text`
  color: #ffffff90;
  font-size: ${(props) => props.theme.text.size.xs};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  margin-bottom: 4px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  height: 50px;
  font-size: ${(props) => props.theme.text.size.sm};
`;

const CustomInput = ({ placeholder, value, setValue, label, style }) => {
  const [_placeholder, _setPlaceholder] = useState(placeholder);

  const handleFocus = () => {
    _setPlaceholder();
  };

  const handleBlur = () => {
    _setPlaceholder(placeholder);
  };

  return (
    <Container style={style}>
      <Label>{label.toUpperCase()}</Label>
      <StyledInput
        value={value}
        onChange={setValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={_placeholder}
        placeholderTextColor="#A1AAD350"
        selectionColor={'#A1AAD390'}
      />
    </Container>
  );
};

export default CustomInput;
