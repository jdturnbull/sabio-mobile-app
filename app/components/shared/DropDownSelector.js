import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableOpacity, Text, View, Modal, FlatList, Dimensions } from 'react-native';
import ArrowUp from '../../assets/icons/24x/ArrowUp';
import ArrowDown from '../../assets/icons/24x/ArrowDown';
import Clear from '../../assets/icons/24x/Clear';

const screenHeight = Dimensions.get('window').height;

const Container = styled.View`
  padding: 10px;
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  border-radius: 5px;
  border: ${(props) => `1px solid ${props.theme.colors.borderHighlight}`};
  border-radius: 8px;
  min-width: 100px;
  margin-bottom: 10px;
  min-height: 70px;
`;

const SelectorButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SelectorText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-size: ${(props) => props.theme.text.size.md};
`;

const DropDownItem = styled(TouchableOpacity)`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderHighlight};
`;

const DropDownItemText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-size: ${(props) => props.theme.text.size.md};
`;

const IconContainer = styled.View`
  width: 24px;
  height: 24px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const Label = styled.Text`
  color: #f8f8f850;
  font-size: ${(props) => props.theme.text.size.xs};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
  margin-bottom: 4px;
`;

const ModalContent = styled.View`
  background-color: ${(props) => props.theme.colors.background2};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  height: ${() => `${screenHeight - 210}px`};
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  shadow-color: black;
  shadow-offset: 2px 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const ModalHeader = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const HeaderText = styled.Text`
  flex: 1;
  margin-right: 50px;
  text-align: center;
  color: #f8f8f8;
  font-size: ${(props) => props.theme.text.size.md};
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
`;

const DropDownSelector = ({ items, value, setValue, label }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  const handleSelect = (item) => {
    setValue(item);
    toggleDropdown();
  };

  return (
    <Container>
      <Label>{label.toUpperCase()}</Label>
      <SelectorButton onPress={toggleDropdown}>
        <SelectorText>{value}</SelectorText>
        <IconContainer>{expanded ? <ArrowUp /> : <ArrowDown />}</IconContainer>
      </SelectorButton>
      <Modal transparent={true} visible={expanded} animationType="slide">
        <ModalContainer>
          <TouchableOpacity style={{ flex: 1 }} onPress={toggleDropdown} />
          <ModalContent>
            <ModalHeader>
              <TouchableOpacity style={{ width: 50 }} onPress={toggleDropdown}>
                <Clear />
              </TouchableOpacity>
              <HeaderText>{label}</HeaderText>
            </ModalHeader>
            <FlatList
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <DropDownItem onPress={() => handleSelect(item)}>
                  <DropDownItemText>{item}</DropDownItemText>
                </DropDownItem>
              )}
            />
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default DropDownSelector;
