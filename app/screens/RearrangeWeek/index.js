import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import moment from 'moment';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import Title from "../../components/shared/Title";
import SubHeader from "../../components/shared/SubHeader";
import Calendar from '../../assets/icons/18x/Calendar';
import getIconFromActivity from "../../utils/getIconFromActivity";
import call from "../../utils/call";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_COLOR_MAP = {
    'Monday': '#885A89',
    'Tuesday': '#D4B483',
    'Wednesday': '#355834',
    'Thursday': '#6D466B',
    'Friday': '#FF8585',
    'Saturday': '#134074',
    'Sunday': '#FF3357',
}

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
    padding-top: 70px;
`;

const Content = styled.View`
    flex: 1;
    flex-direction: row;
    margin-top: 20px;
`;

const Left = styled.View`
    height: 650px;
`;

const Right = styled.View`
    flex: 1;
    margin-left: 10px;
    height: 650px;
`;

const DayContainer = styled.View`
    width: 70px;
    height: 92px;
    flex-direction: row;
    align-items: flex-start;
`;

const DayText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.grey};
    margin-left: 5px;
`;

const ItemContainer = styled(Animated.View)`
    flex: 1;
    height: 87px;
    border: 2px dashed ${(props) => props.color ? 'transparent' : props.theme.colors.background3};
    background-color: ${(props) => props.color ? props.theme.colors.background3 : 'transparent'};
    border-radius: 8px;
    padding: 5px;
    margin-bottom: 5px;
`;

const ActivityContainer = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`;

const ActivityText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    font-size: ${(props) => props.theme.text.size.sm};
    font-weight: ${(props) => props.theme.text.weight.bold};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    color: ${(props) => props.theme.text.colors.white};
    margin-left: 5px;
`;

const UpdateTouchable = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.primary};
    padding: 5px 15px;
    border-radius: 8px;
`;

const UpdateText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    text-align: center;
`;

const RearrangeWeek = ({ navigation, route }) => {
    const { week } = route.params;

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const computeActivitiesIntoDays = (activities) => {
        let response = [
            { id: 1, day: 'Monday', activities: [] },
            { id: 2, day: 'Tuesday', activities: [] },
            { id: 3, day: 'Wednesday', activities: [] },
            { id: 4, day: 'Thursday', activities: [] },
            { id: 5, day: 'Friday', activities: [] },
            { id: 6, day: 'Saturday', activities: [] },
            { id: 7, day: 'Sunday', activities: [] }
        ];

        // We show a max of three activities, we can't show a 4th as we simply dont have space

        for (let i = 0; i < activities.length; i++) {
            const day = moment(activities[i].date).format('dddd');
            const index = response.findIndex(item => item.day === day);
            if (response[index].activities.length < 3) {
                response[index].activities.push(activities[i]);
            }
        }

        return response;
    };

    const [listItems, setListItems] = useState(computeActivitiesIntoDays(week.activities));

    useEffect(() => {
        setListItems(computeActivitiesIntoDays(week.activities));
    }, [week]);

    const positions = listItems.map((_, index) => useSharedValue(1 * index));

    const handleGesture = (event, index) => {
        positions[index].value = event.translationY + index;
    };

    const handleGestureEnd = (event, index) => {
        const indexChange = Math.round(positions[index].value / 92);
        const newData = listItems.slice();
        const [movedItem] = newData.splice(index, 1);
        const startIndex = listItems.findIndex(item => item.day === movedItem.day);
        const newIndex = startIndex + indexChange;

        if (newIndex > -1 && newIndex < 7) {
            newData.splice(newIndex, 0, movedItem);

            positions[startIndex].value = withSpring(positions[newIndex].value);
            positions[newIndex].value = withSpring(newIndex);

            runOnJS(setListItems)(newData);
            runOnJS(setHasUnsavedChanges)(true);

            positions.forEach((pos, idx) => {
                pos.value = withSpring(idx);
            });
        }
    };

    const handleBack = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            navigation.goBack();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    }

    const handleUpdate = async () => {
        const activitiesToUpdate = [];

        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];

            for (let j = 0; j < item.activities.length; j++) {
                const new_day = DAYS[i];
                const existing_day = moment(item.activities[j].date).format('dddd');

                if (new_day !== existing_day) {
                    const difference = DAYS.indexOf(new_day) - DAYS.indexOf(existing_day);

                    let new_date;

                    if (difference > 0) {
                        new_date = moment(item.activities[j].date).add(difference, 'days').toDate();
                    } else {
                        new_date = moment(item.activities[j].date).subtract(Math.abs(difference), 'days').toDate();
                    }

                    activitiesToUpdate.push({
                        ...item.activities[j],
                        date: new_date
                    });
                }
            }
        }

        if (activitiesToUpdate.length > 0) {
            await call('POST', "users/reorganiseWeek", { activities: activitiesToUpdate });
            navigation.goBack();
        }
    };

    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10, flex: 1 }}>Rearrange Week {week.week}</Title>
                <UpdateTouchable onPress={handleUpdate}>
                    <UpdateText>Save</UpdateText>
                </UpdateTouchable>
            </View>
            <SubHeader style={{ marginBottom: 20 }}>Reorder days to rearrange your week</SubHeader>
            <Content>
                <Left>
                    {DAYS.map((day, index) => (
                        <DayContainer key={day}>
                            <View style={{ marginTop: 1 }}>
                                <Calendar color={'#f8f8f840'} />
                            </View>
                            <DayText>{day.substring(0, 3).charAt(0).toUpperCase() + day.substring(1, 3).toLowerCase()}</DayText>
                        </DayContainer>
                    ))}
                </Left>
                <Right>
                    {listItems.map((item, index) => {
                        const animatedStyle = useAnimatedStyle(() => {
                            return {
                                transform: [{ translateY: positions[index].value }],
                                height: 92
                            };
                        });

                        const RestIcon = getIconFromActivity('rest');

                        return (
                            <PanGestureHandler
                                key={item.id}
                                onGestureEvent={(event) => handleGesture(event.nativeEvent, index)}
                                onEnded={(event) => handleGestureEnd(event.nativeEvent, index)}
                            >
                                <Animated.View style={animatedStyle}>
                                    <ItemContainer color={item.activities.length > 0 ? DAY_COLOR_MAP[item.day] : null}>
                                        {item.activities.map((activity, index) => {
                                            return (
                                                <ActivityContainer key={index}>
                                                    <Text>{activity.icon}</Text>
                                                    <ActivityText>{activity.title}</ActivityText>
                                                </ActivityContainer>
                                            )
                                        })}
                                        {!item.activities.length && (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                                <RestIcon color={'#A1AAD340'} />
                                            </View>
                                        )}
                                    </ItemContainer>
                                </Animated.View>
                            </PanGestureHandler>
                        );
                    })}
                </Right>
            </Content>
        </Container>
    )
};

export default RearrangeWeek;


