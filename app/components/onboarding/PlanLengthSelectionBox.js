import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import CustomSlider from '../shared/CustomSlider';
import DateInput from '../shared/DateInput';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

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
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.text.colors.grey};
`;

const PlanLengthSelectionBox = ({ item, selected, setSelected, date, setDate, weeks, setWeeks }) => {
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value, { duration: 300 }),
    opacity: withTiming(height.value > 0 ? 1 : 0, { duration: 300 }),
  }));

  const handlePress = () => {
    setSelected(item.label);

    if (item.label === 'Custom Length') {
      height.value = height.value === 100 ? 0 : 100;
    }

    if (item.label === 'Custom Date') {
      height.value = height.value === 300 ? 0 : 300;
    }
  };

  if (item.label === 'Custom Length') {
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
        {selected && (
          <Animated.View style={animatedStyle}>
            <CustomSlider label={'Weeks'} value={weeks} setValue={setWeeks} max={52} min={4} step={1} />
          </Animated.View>
        )}
      </View>
    );
  }

  if (item.label === 'Custom Date') {
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
        {selected && (
          <Animated.View style={animatedStyle}>
            <DateInput value={date} setValue={setDate} placeholder={'End date'} label={'Plan end date'} />
          </Animated.View>
        )}
      </View>
    );
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
