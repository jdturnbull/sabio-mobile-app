import React, { useEffect } from "react";
import styled from "styled-components";
import moment from 'moment';
import getIconFromActivity from "../../../../utils/getIconFromActivity";
import { TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from "@react-navigation/native";

const DAY_COLOR_MAP = {
    'Monday': '#A1AAD3',
    'Tuesday': '#D4B483',
    'Wednesday': '#355834',
    'Thursday': '#6D466B',
    'Friday': '#FF8585',
    'Saturday': '#134074',
    'Sunday': '#FF3357',
}

const Container = styled(TouchableOpacity)`
  flex: 1;
  padding: 15px;
  background-color: ${(props) => props.theme.colors.background2};
  margin-vertical: 8px;
  border-radius: 8px;
  border-left-width: 2px;
`;

const Top = styled.View`
margin-bottom: 10px;
`;

const DayText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    font-size: ${(props) => props.theme.text.size.md};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
`;

const Mid = styled.View`
`;

const IconActivity = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 5px;
    padding-right: 20px;
`;

const ActivityTitle = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    margin-left: 5px;
`;

const ProgressBarContainer = styled.View`
    height: 4px;
    background-color: ${(props) => props.theme.colors.background3};
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
`;

const ProgressBar = styled(Animated.View)`
    height: 100%;
    background-color: ${(props) => props.color};
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
`;

const DayItem = ({ _day }) => {
    const { activities, day } = _day;
    const navigation = useNavigation();
    const progress = useSharedValue(0);

    useEffect(() => {
        const completed = activities.every(activity => activity.status === 'COMPLETE');
        progress.value = withTiming(completed ? 100 : 0, { duration: 500 });
    }, [activities]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });

    const handlePress = () => {
        navigation.navigate('ViewActivity', { _day });
    };

    const handleComplete = () => { };

    const icons_and_titles = activities.map(activity => ({ Icon: getIconFromActivity(activity.icon), title: activity.title }));

    return (
        <Container onPress={handlePress} style={{ borderLeftColor: DAY_COLOR_MAP[day] }}>
            <Top>
                <DayText>{day}</DayText>
            </Top>
            <Mid>
                {icons_and_titles.map(({ Icon, title }) => (
                    <IconActivity key={title}>
                        <Icon />
                        <ActivityTitle numberOfLines={1}>{title}</ActivityTitle>
                    </IconActivity>
                ))}
            </Mid>
            <ProgressBarContainer>
                <ProgressBar color={DAY_COLOR_MAP[day]} style={animatedStyle} />
            </ProgressBarContainer>
        </Container>
    );
};

export default DayItem;