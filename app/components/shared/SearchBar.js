import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SearchIcon from '../../assets/icons/24x/Search';
import ClearIcon from '../../assets/icons/24x/Clear';
import { TouchableOpacity } from 'react-native';

const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  border: ${(props) => `1px solid ${props.theme.colors.borderHighlight}`};
  padding: 15px;
  border-radius: 8px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  margin-horizontal: 10px;
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.md};
`;

const SearchBar = ({ style, onSubmit }) => {
  const [placeholder, setPlaceholder] = useState('Search');
  const [text, setText] = useState('');
  const timerRef = useRef(null);

  const handleClear = () => setText('');

  const handleFocus = () => setPlaceholder();
  const handleBlur = () => setPlaceholder('Search');

  const handleSubmit = async () => {
    await onSubmit(text);
  };

  useEffect(() => {
    if (text) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        handleSubmit();
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [text]);

  return (
    <Container style={style}>
      <SearchIcon color={'#A1AAD390'} />
      <StyledInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={setText}
        value={text}
        keyboardAppearance="dark"
        blurOnSubmit={true}
        placeholder={placeholder}
        placeholderTextColor="#A1AAD350"
        selectionColor={'#A1AAD390'}
      />
      {text !== '' && (
        <TouchableOpacity onPress={handleClear}>
          <ClearIcon color={'#A1AAD350'} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

export default SearchBar;
