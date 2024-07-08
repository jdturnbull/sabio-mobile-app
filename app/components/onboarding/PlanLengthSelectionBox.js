import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import CustomSlider from '../shared/CustomSlider';

const Container = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.backgroundLight1};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LabelText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: 18px;
  color: ${(props) => props.theme.text.colors.white};
`;

const RingOuter = styled.View`
  height: 26px;
  width: 26px;
  border-radius: 13px;
  border: ${(props) => (props.selected ? '1px solid #EE6E12' : '1px solid #000')};
  background-color: ${(props) => (props.selected ? '#EE6E12' : 'transparent')};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RingInner = styled.View`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? '#000' : 'transparent')};
`;

const SubLabel = styled.Text``;

const Left = styled.View`
  flex: 1;
`;

const EndDateText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.grey};
`;

const PlanLengthSelectionBox = ({ item, selected, setSelected }) => {
  // We return two types of selection box depending on the item
  const [weekLength, setWeekLength] = useState(12);

  const handlePress = () => {
    setSelected(item.label);
  };

  if (item.label === 'Custom Plan Length') {
    return (
      <View>
        <Container onPress={handlePress}>
          <Left>
            <LabelText>{item.label}</LabelText>
            <EndDateText>{item.subLabel}</EndDateText>
          </Left>
          <RingOuter selected={selected}>
            <RingInner selected={selected} />
          </RingOuter>
        </Container>
        {selected && <CustomSlider value={weekLength} setValue={setWeekLength} max={52} min={0} step={1} />}
      </View>
    );
  }

  if (item.label === 'Custom End Date') {
    return <Container />;
  }

  return (
    <Container onPress={handlePress}>
      <Left>
        <LabelText>{item.label}</LabelText>
        <EndDateText>{`Ending ${item.endDate}`}</EndDateText>
      </Left>
      <RingOuter selected={selected}>
        <RingInner selected={selected} />
      </RingOuter>
    </Container>
  );
};

export default PlanLengthSelectionBox;
