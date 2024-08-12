import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components/native";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import moment from 'moment';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import Title from "../../components/shared/Title";
import SubHeader from "../../components/shared/SubHeader";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import call from "../../utils/call";
import Calendar from '../../assets/icons/14x/Calendar';
import Rocket from '../../assets/icons/14x/Rocket';
import WeekOverview from './components/WeekOverview';
import InfoButton from "../../components/shared/InfoButton";

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
    padding-top: 70px;
`;

const TopContainer = styled.View`
    background-color: ${(props) => props.theme.colors.background2};
    padding: 15px;
    border-radius: 10px;
`;

const Header = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    font-size: ${(props) => props.theme.text.size.sm};
`;

const SubText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.darkGrey};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    font-size: ${(props) => props.theme.text.size.xs};
`;

const WeekContainer = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 7px;
    margin-top: 10px;
    flex-wrap: wrap;
`;

const WeekIndicator = styled.View`
    background-color: ${(props) => props.theme.colors.background3};
    width: 30px;
    height: 10px;
    border-radius: 10px;
`;

const WeekProgress = styled.View`
    background-color: ${(props) => props.theme.colors.primary};
    height: 10px;
    border-radius: 10px;
`;

const PlanOverview = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user?.user);
    const training_plans = useSelector((state) => state.user.training_plans);
    const training_plan = useMemo(() => training_plans.find((plan) => plan.status === 'ACTIVE'), [training_plans]);

    const [loading, setLoading] = useState(true);
    const [completionData, setCompletionData] = useState();
    const [planWeeks, setPlanWeeks] = useState([]);
    const [number_of_weeks, setNumberOfWeeks] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const compute = useCallback(async () => {
        setLoading(true);
        const [completionResponse, planWeeksResponse] = await Promise.all([
            call('GET', `users/completionData/${training_plan.id}`),
            call('GET', `users/planWeeks/${training_plan.id}`)
        ]);
        setCompletionData(completionResponse);
        setNumberOfWeeks(Object.keys(completionResponse.weeklyCompletions).length);
        setPlanWeeks(planWeeksResponse);
        setLoading(false);
    }, [training_plan.id]);

    useEffect(() => {
        compute();
    }, [compute]);

    const handleBack = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            navigation.goBack();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    const showInfo = !user.first_screen_views['Plan Overview'];


    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10 }}>Plan Overview</Title>
            </View>
            <SubHeader>Here's how Sabio will guide you to achieving your goals!</SubHeader>
            <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
                <InfoButton showInfo={showInfo} location={"Plan Overview"} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <TopContainer>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Header>{training_plan.name}</Header>
                            <SubText style={{ marginTop: 4 }}>{`Goal date: ${moment(training_plan.end_date).format('MMM DD, YYYY')}`}</SubText>
                        </View>
                        <View>
                            {loading && <ActivityIndicator />}
                        </View>
                    </View>
                    {completionData && <WeekContainer>
                        {Object.entries(completionData.weeklyCompletions).map(([week, data]) => (
                            <WeekIndicator key={week}>
                                <WeekProgress style={{ width: `${data}%` }} />
                            </WeekIndicator>
                        ))}
                    </WeekContainer>}
                    {completionData && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 5 }}>
                            <Calendar color={'#f8f8f840'} />
                            <SubText>{`${number_of_weeks} weeks`}</SubText>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 5 }}>
                            <Rocket color={'#f8f8f840'} />
                            <SubText>{`${completionData.completion_percentage}% Complete`}</SubText>
                        </View>
                    </View>}
                </TopContainer>
                <View>
                    {planWeeks.map((week) => (
                        <WeekOverview key={week.week} compute={compute} week={week} />
                    ))}
                </View>
            </ScrollView>
        </Container>
    )
};

export default PlanOverview;