import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import styled from 'styled-components';
import Tick from '../../../assets/icons/14x/TickNoCircle';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import Activity from "./Activity";

const DAY_COLOR_MAP = {
    'Monday': '#885A89',
    'Tuesday': '#D4B483',
    'Wednesday': '#355834',
    'Thursday': '#469db9',
    'Friday': '#FF8585',
    'Saturday': '#134074',
    'Sunday': '#FF3357',
}

const Container = styled.View`
    padding: 15px;
    background-color: ${(props) => props.theme.colors.background2};
    margin-top: 20px;
    border-radius: 10px;
`;

const WeekText = styled.Text`
    flex: 1;
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    font-size: ${(props) => props.theme.text.size.sm};
`;

const CompleteTouchable = styled(TouchableOpacity)`
    height: 20px;
    width: 20px;
    border: ${(props) => props.complete ? `2px solid #EE6E12` : '2px solid #A1AAD315'};
    background-color: ${(props) => props.complete ? '#EE6E12' : 'transparent'};
    border-radius: 5px;
    align-items: center;
    justify-content: center;
`;

const ActivityIndicator = styled.View`
    flex: 1;    
    height: 5px;
    background-color: #A1AAD315;
    border-radius: 5px;
`;

const ActivityProgressBar = styled(Animated.View)`
    height: 5px;
    background-color: #EE6E12;
    border-radius: 5px;
`;

const IndicatorContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    gap: 5px;
`;

const SubText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.darkGrey};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    font-size: ${(props) => props.theme.text.size.xs};
`;

const WeekOverview = ({ week, compute }) => {
    const progress = useSharedValue(0);

    const completed = useMemo(() => week.activities.every(activity => activity.status === 'COMPLETE'), [week.activities]);

    useEffect(() => {
        progress.value = withTiming(completed ? 100 : 0, { duration: 500 });
    }, [completed]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });


    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <WeekText>{`Week ${week.week}`}</WeekText>
                {week.complete && <CompleteTouchable disabled complete={week.complete}>
                    <Tick />
                </CompleteTouchable>}
            </View>
            <IndicatorContainer>
                {week.activities.map((a) => (
                    <ActivityIndicator key={a.id}>
                        <ActivityProgressBar style={[animatedStyle, { width: `${a.status === 'COMPLETE' ? 100 : 0}%` }]} />
                    </ActivityIndicator>
                ))}
            </IndicatorContainer>
            <SubText style={{ marginTop: 5 }}>{`Workouts: ${week.activities.length}`}</SubText>
            <View style={{ marginTop: 5 }}>
                {week.activities.map((a) => (
                    <Activity key={a.id} activity={a} />
                ))}
            </View>
        </Container>
    );
}

export default WeekOverview;