import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import styled from 'styled-components';
import * as shape from 'd3-shape';

const Container = styled(TouchableOpacity)`
  background-color: ${(props) => (props.light ? props.theme.colors.background3 : props.theme.colors.background2)};
  padding: 12px;
  border-radius: 8px;
  margin-vertical: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LabelText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.sm};
  color: ${(props) => props.theme.text.colors.white};
`;

const RingOuter = styled.View`
  height: 22px;
  width: 22px;
  border-radius: 11px;
  border: ${(props) => (props.selected ? '1px solid #EE6E12' : '1px solid #000')};
  background-color: ${(props) => (props.selected ? '#EE6E12' : 'transparent')};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RingInner = styled.View`
  height: 7px;
  width: 7px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? '#000' : 'transparent')};
`;

const SelectableItem = ({ label, onPress, selected, light, hasChart, chartData, noCurve }) => {
  const handlePress = () => onPress(label);

  return (
    <Container light={light} onPress={handlePress}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center' }}>
          <LabelText>{label}</LabelText>
        </View>
        {hasChart && (
          <View style={{ width: 100, height: 20, marginLeft: 20 }}>
            {noCurve ? (
              <LineChart
                style={{ flex: 1 }}
                data={chartData}
                svg={{ stroke: '#f8f8f840' }}
                contentInset={{ top: 5, bottom: 5 }}
                yAccessor={({ item }) => item}
                showGrid={false}
              />
            ) : (
              <LineChart
                style={{ flex: 1 }}
                data={chartData}
                svg={{ stroke: '#f8f8f840' }}
                contentInset={{ top: 5, bottom: 5 }}
                yAccessor={({ item }) => item}
                showGrid={false}
                curve={shape.curveNatural}
              />
            )}
          </View>
        )}
      </View>
      <RingOuter selected={selected}>
        <RingInner selected={selected} />
      </RingOuter>
    </Container>
  );
};

export default SelectableItem;
