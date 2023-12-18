import React from 'react';
const moment = require('moment');
import { useWindowDimensions, View } from 'react-native';
import Styled, { useTheme } from 'styled-components';
import { getIconFromLabel } from '../../../../../utils/icon';

const CHART_HEIGHT = 199;
const ROW_HEIGHT = CHART_HEIGHT / 4;

const Container = Styled.View``;

const TopBox = Styled.View`
  padding: 10px;
  background-color: ${(props) => props.theme.colors.progressDropDownBackground};
  align-self: flex-start;
  border-radius: 18px;
  margin-bottom: 25px;
`;

const TopBoxText = Styled.Text`
  font-size: 12px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  color: ${(props) => props.theme.colors.progressLabelText};  
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const Chart = Styled.View`
  height: ${CHART_HEIGHT}px;
  width: 100%;
`;

const XAxis = Styled.View`
  height: 40px;
  position: absolute;
  bottom: 0;
  margin-left: 30px;
  flex-direction: row;
  align-items: center;
`;

const Overlay = Styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const RowContainer = Styled.View`
  flex-direction: row;
  align-items: flex-start;
  height: ${ROW_HEIGHT}px;
`;

const Row = Styled.View`
  height: 1px;
  background-color: ${(props) => props.theme.colors.chartDash};
  flex: 1;
  margin-top: 8px;
`;

const BarDistanceText = Styled.Text`
  font-size: 13px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-family: ${(props) => props.theme.text.family};
`;

const YLabel = Styled.Text`
  width: 30px;
  margin-left: 5px;
  color: #A8A8A8;
  font-size: 10px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-family: ${(props) => props.theme.text.family};
`;

const BarContainer = Styled.View`
  position: absolute;
  height: ${CHART_HEIGHT - 45}px;
  margin-top: 5px;
  width: 100%;
  align-self: flex-end;
  flex-direction: row;
`;

const XAxisText = Styled.Text`
  font-size: 10px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  color: #A8A8A8;
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-family: ${(props) => props.theme.text.family};
`;

const ChartComponent = ({ data, maxVal, label, YAxisLabel, fromDate, toDate }) => {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const CHART_WIDTH = screenWidth - 50;

  const YAxisMin = 0;
  let YAxisMax = maxVal * 1.4;
  YAxisMax = Math.ceil(YAxisMax / 10) * 10;
  const YAxisLabelInterval = (YAxisMax - YAxisMin) / 3;

  // Get dates between from and to date
  const dates = [];

  const startDate = moment(fromDate, 'YYYY-MM-DD');
  const endDate = moment(toDate, 'YYYY-MM-DD');

  while (startDate <= endDate) {
    dates.push(startDate.format('YYYY-MM-DD'));
    startDate.add(1, 'days');
  }

  return (
    <Container>
      <TopBox>
        <TopBoxText>{label}</TopBoxText>
      </TopBox>
      <Chart style={{ width: CHART_WIDTH }}>
        <XAxis style={{ width: CHART_WIDTH - 30 }}>
          {dates.map((date, index) => {
            return (
              <View
                style={{
                  width: (CHART_WIDTH - 30) / 7,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <XAxisText>{moment(date, 'YYYY-MM-DD').format('ddd')}</XAxisText>
              </View>
            );
          })}
        </XAxis>
        <Overlay style={{ width: CHART_WIDTH }}>
          <RowContainer>
            <YLabel numberOfLines={1}>
              {YAxisMax}
              {YAxisLabel}
            </YLabel>
            <Row />
          </RowContainer>
          <RowContainer>
            <YLabel numberOfLines={1}>
              {Math.round(YAxisMax - YAxisLabelInterval)}
              {YAxisLabel}
            </YLabel>
            <Row />
          </RowContainer>
          <RowContainer>
            <YLabel numberOfLines={1}>
              {Math.round(YAxisMax - YAxisLabelInterval * 2)}
              {YAxisLabel}
            </YLabel>
            <Row />
          </RowContainer>
          <RowContainer>
            <YLabel numberOfLines={1}>
              {YAxisMin}
              {YAxisLabel}
            </YLabel>
            <Row />
          </RowContainer>
        </Overlay>
        <BarContainer style={{ width: CHART_WIDTH - 30 }}>
          {dates.map((date, index) => {
            const activity = data.find((item) => item.date === date);

            if (!activity || activity.value === 0) {
              return (
                <View style={{ width: (CHART_WIDTH - 30) / 7, paddingHorizontal: 5, alignSelf: 'flex-end' }}></View>
              );
            }

            const barWidth = (CHART_WIDTH - 30) / dates.length;
            const barHeight = (activity.value / YAxisMax) * (CHART_HEIGHT - 45);
            const barMargin = 10;

            const Icon = getIconFromLabel(activity.type) || getIconFromLabel('default');

            return (
              <View style={{ width: (CHART_WIDTH - 30) / 7, paddingHorizontal: 5, alignSelf: 'flex-end' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginRight: 5 }}>
                  <Icon color={theme.barColors[activity.type] || theme.barColors.default} />
                </View>
                <View
                  style={{
                    width: barWidth - barMargin,
                    height: barHeight,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    backgroundColor: theme.barColors[activity.type] || theme.barColors.default,
                  }}
                />
              </View>
            );
          })}
        </BarContainer>
      </Chart>
    </Container>
  );
};

export default ChartComponent;
