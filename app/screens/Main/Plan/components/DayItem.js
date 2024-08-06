import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from "@react-navigation/native";
import { hapticImpact } from "../../../../utils/haptics";
import Tick from '../../../../assets/icons/14x/TickNoCircle';
import call from "../../../../utils/call";
import { useSelector } from "react-redux";

const DAY_COLOR_MAP = {
    'Monday': '#885A89',
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
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 3.84px;
`;

const Top = styled.View`
margin-bottom: 10px;
flex-direction: row;
justify-content: space-between;
`;

const CompleteTouchable = styled(TouchableOpacity)`
    padding: 5px;
    align-items: center;
    justify-content: center;
`;

const CompleteInner = styled.View`
    height: 20px;
    width: 20px;
    border: ${(props) => props.complete ? `2px solid ${props.dayColor}` : '2px solid #A1AAD315'};
    background-color: ${(props) => props.complete ? props.dayColor : 'transparent'};
    border-radius: 5px;
    align-items: center;
    justify-content: center;
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

const EmojiText = styled.Text``;

const DayItem = ({ _day, recoveryGuidance, index }) => {
    const { activities, day } = _day;
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);
    const progress = useSharedValue(0);

    const [complete, setComplete] = useState(activities.every(activity => activity.status === 'COMPLETE'));

    useEffect(() => {
        setComplete(activities.every(activity => activity.status === 'COMPLETE'));
    }, [activities]);

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
        navigation.navigate('ViewDay', { _day, recoveryGuidance });
    };


    const handleComplete = async () => {
        const { training_plan_id } = _day.activities[0];

        if (complete) {
            setComplete(false);
            progress.value = withTiming(0, { duration: 500 });
            await call('POST', 'users/uncompleteDay', { planId: training_plan_id, date: _day.date })
        } else {
            setComplete(true);
            hapticImpact();
            progress.value = withTiming(100, { duration: 500 });
            await call('POST', 'users/completeDay', { planId: training_plan_id, date: _day.date })
        }
    };

    const icons_and_titles = activities.map(activity => ({ icon: activity.icon, title: activity.title }));


    return (
        <Container onPress={handlePress} style={{ borderLeftColor: DAY_COLOR_MAP[day] }}>
            <Top>
                <DayText>{day}</DayText>
                <CompleteTouchable onPress={handleComplete}>
                    <CompleteInner complete={complete} dayColor={DAY_COLOR_MAP[day]}>
                        {complete && <Tick />}
                    </CompleteInner>
                </CompleteTouchable>
            </Top>
            <Mid>
                {icons_and_titles.map(({ icon, title }) => (
                    <IconActivity key={title}>
                        <EmojiText>{icon}</EmojiText>
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