import React from "react";
import styled from "styled-components";
import { Image, View } from "react-native";
import { LineChart, YAxis, XAxis } from 'react-native-svg-charts';
import BodyText from "../../../../components/shared/BodyText";
import { theme } from "../../../../utils/theme";
import mascot from '../../../../assets/mascot/wave_right.png'

const Container = styled.View`
    padding: 15px;
    background-color: ${({ theme }) => theme.colors.background2};
    border-radius: 8px;
    margin-bottom: 10px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 2;
`;

const Indicator = styled.View`
    width: 20px;
    height: 10px;
    border-radius: 5px;
    background-color: ${({ theme, completed }) => completed ? theme.colors.primary : theme.colors.background3};
    margin-right: 5px;
`;

const LargeText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
    color: ${(props) => props.theme.text.colors.white};
`;

const SmallText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: 10px;
    color: ${(props) => props.theme.text.colors.white};
`;

const Report = ({ report }) => {
    const totalActivities = report?.analysis.totalActivities;
    const completedActivities = report?.analysis.completedActivities;
    const weeklyCompletion = report?.analysis.completion_rate;

    const data = report?.analysis?.completion_rate_over_time;


    const yMin = Math.min(...data);
    const yMax = Math.max(...data);

    return (
        <Container>
            <BodyText style={{ fontWeight: 500 }}>{report.title}</BodyText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                {Array.from({ length: totalActivities }).map((_, index) => (
                    <Indicator key={index} completed={index + 1 <= completedActivities} />
                ))}
            </View>
            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginRight: 20 }}>
                    <LargeText>
                        {weeklyCompletion}%
                    </LargeText>
                    <SmallText>Completion rate</SmallText>
                </View>
                <View style={{ marginRight: 20 }}>
                    <LargeText>
                        {totalActivities}
                    </LargeText>
                    <SmallText>Activities</SmallText>
                </View>
                <View style={{ marginRight: 20 }}>
                    <LargeText>
                        {completedActivities}
                    </LargeText>
                    <SmallText>Completed</SmallText>
                </View>
            </View>
            <View style={{ marginTop: 20, marginBottom: 10 }}>
                <BodyText>Completion rate over time</BodyText>
            </View>
            <View style={{ height: 150, flexDirection: 'row' }}>
                <YAxis
                    data={data.map(d => d)}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{
                        fill: theme.text.colors.white,
                        fontSize: 10,
                    }}
                    numberOfTicks={4}
                    formatLabel={(value) => `${value}%`}
                    min={yMin}
                    max={yMax}
                />
                <LineChart
                    style={{ flex: 1, marginLeft: 10 }}
                    data={data}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}
                    yMin={yMin}
                    yMax={yMax}
                    yAccessor={({ item }) => item}
                >
                </LineChart>
            </View>
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Image source={mascot} style={{ width: 20, height: 20, marginRight: 10 }} />
                    <BodyText style={{ fontWeight: 500, fontSize: 18 }}>Sabio</BodyText>
                </View>
                <SmallText style={{ fontSize: 11, lineHeight: 17, fontStyle: 'italic' }}>{report?.summary}</SmallText>
            </View>
        </Container>
    )
}

export default Report;