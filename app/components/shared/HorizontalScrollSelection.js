import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ScrollView, TouchableOpacity } from 'react-native';
import Title from '../shared/Title';
import CustomInput from './CustomInput';

const Container = styled.View``;

const ScrollItemContainer = styled(TouchableOpacity)`
  padding-horizontal: 20px;
  padding-vertical: 10px;
  margin-horizontal: 7px;
  border-radius: 30px;
  background-color: ${(props) => props.theme.colors.backgroundLight1};
`;

const ScrollItemText = styled.Text`
  color: #f8f8f8;
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
`;

const ScrollItem = ({ item, selected, onPress, index }) => {
  const handlePress = () => onPress(item);

  return (
    <ScrollItemContainer
      onPress={handlePress}
      style={
        selected && index === 0
          ? { backgroundColor: '#EE6E12', marginLeft: 0 }
          : selected
          ? { backgroundColor: '#EE6E12' }
          : index === 0
          ? { marginLeft: 0 }
          : {}
      }>
      <ScrollItemText>{item}</ScrollItemText>
    </ScrollItemContainer>
  );
};

const CustomSection = styled.View`
  margin-top: 20px;
  border-radius: 10px;
`;

const HorizontalScrollSelection = ({
  label,
  style,
  items,
  setValue,
  value,
  customLabel,
  customPlaceholder,
  onFocus,
}) => {
  const [selected, setSelected] = useState(value);
  const [expanded, setExpanded] = useState(false);

  const scrollRef = useRef();

  const handleItemPress = (item) => {
    if (item === 'Custom') {
      setExpanded(true);
      setSelected(item);
    } else {
      setValue(item);
      setSelected(item);
      setExpanded(false);
    }
  };

  const handleFocus = () => {
    if (onFocus) onFocus(label);
  };

  return (
    <Container style={[style]}>
      {label && <Title style={{ marginBottom: 10, marginTop: 10, fontSize: 20 }}>{label}</Title>}
      <ScrollView
        ref={scrollRef}
        style={{ marginTop: 10 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="slow">
        {items.map((item, i) => (
          <ScrollItem key={i} index={i} item={item} selected={selected === item} onPress={handleItemPress} />
        ))}
      </ScrollView>
      {expanded && (
        <CustomSection>
          <CustomInput
            onFocus={handleFocus}
            label={customLabel}
            value={value}
            setValue={setValue}
            placeholder={customPlaceholder}
          />
        </CustomSection>
      )}
    </Container>
  );
};

export default HorizontalScrollSelection;
