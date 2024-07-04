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
  padding: 15px;
  border-radius: 8px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  margin-horizontal: 10px;
  color: #fff;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.regular};
  font-size: ${(props) => props.theme.text.size.sm};
  ::placeholder {
    color: ${(props) => props.theme.text.colors.highlight};
    font-size: ${(props) => props.theme.text.size.xs};
    font-weight: ${(props) => props.theme.text.weight.bold};
  }
`;

const SearchBar = ({ style, onSubmit }) => {
  const [placeholder, setPlaceholder] = useState('Search');
  const [text, setText] = useState('');
  const timerRef = useRef(null);

  const handleClear = () => setText('');

  const handleFocus = () => setPlaceholder('');
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
      <SearchIcon color={'#a1aad3'} />
      <StyledInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={setText}
        value={text}
        placeholder={placeholder}
        placeholderTextColor="#ffffff80"
        selectionColor={'#ffffff80'}
      />
      {text !== '' && (
        <TouchableOpacity onPress={handleClear}>
          <ClearIcon color={'#16171B'} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

export default SearchBar;
