import React from "react";
import { ScrollView, View, Text } from "react-native";
import styled from "styled-components";

import Plan from '../../../../assets/icons/18x/Course';
import Calendar from '../../../../assets/icons/18x/Calendar';
import Repeat from '../../../../assets/icons/18x/Repeat';
import Edit from '../../../../assets/icons/18x/Edit';


import TopButtons from '../../../../screens/Main/Plan/components/PlanScreenOptions';
import SabioMessage from "../../../../screens/Main/Plan/components/SabioMessage";

const Container = styled.View`
    flex: 1
`;

const ExplainerHeader = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.white};
`;

const ExplainerText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.grey};
    line-height: 22px;
`;

const IconContainer = styled.View`
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: ${(props) => props.theme.colors.background3};
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

const PlanExplainer = () => {
    return (
        <Container>
            <View style={{ marginTop: 10 }}>
                <ExplainerHeader style={{ marginBottom: 20 }}>The options box at the top of your screen</ExplainerHeader>
                <TopButtons disabled />
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconContainer>
                            <Plan color={'#f8f8f8'} />
                        </IconContainer>
                        <ExplainerHeader>
                            Overview
                        </ExplainerHeader>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ExplainerText>
                            Shows you a summary of your plan
                        </ExplainerText>
                    </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconContainer>
                            <Calendar color={'#f8f8f8'} />
                        </IconContainer>
                        <ExplainerHeader>
                            Organise
                        </ExplainerHeader>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ExplainerText>
                            Change your weekly schedule
                        </ExplainerText>
                    </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconContainer>
                            <Edit color={'#f8f8f8'} />
                        </IconContainer>
                        <ExplainerHeader>
                            Adjust
                        </ExplainerHeader>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ExplainerText>
                            Make adjustments to your plan by adding preferences, equipment and more
                        </ExplainerText>
                    </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconContainer>
                            <Repeat color={'#f8f8f8'} />
                        </IconContainer>
                        <ExplainerHeader>
                            Switch
                        </ExplainerHeader>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ExplainerText>
                            Switch between your training plans
                        </ExplainerText>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <ExplainerHeader style={{ marginBottom: 20 }}>Beneath the options box you'll find Sabio's guidance for the week</ExplainerHeader>
                <SabioMessage focus={""} nutrition={{ caloric_intake: '', macronutrients: '' }} disabled />
                <ExplainerText style={{ marginTop: 20 }}>Sabio's guidance is completely personal to you and your goal, it includes a focus for the week, a caloric intake and macronutrient breakdown</ExplainerText>
            </View>
            <View style={{ marginTop: 20 }}>
                <ExplainerHeader style={{ marginBottom: 20 }}>Below this you'll find your plan for the week</ExplainerHeader>
                <ExplainerText>Swipe left and right to go forwards and backwards through the weeks</ExplainerText>
            </View>
            <View style={{ height: 30 }} />
        </Container>
    )
}

export default PlanExplainer