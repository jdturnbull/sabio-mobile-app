import React from "react";
import { View } from "react-native";
import styled from "styled-components";

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

const Profile = () => {
    return (
        <Container>
            <View style={{ marginTop: 10 }}>
                <ExplainerHeader style={{ marginBottom: 10 }}>The profile screen allows you to make adjustments to your plan, in turn changing the activities you'll be doing</ExplainerHeader>
                <View style={{ marginTop: 20 }}>
                    <ExplainerHeader style={{ marginBottom: 10 }}>Equipment and facilities</ExplainerHeader>
                    <ExplainerText>If you add new equipment, Sabio will evaluate whether use of this will optimise your current plan. If you remove equipment Sabio will replan workouts that make use of this equipment</ExplainerText>
                </View>
                <View style={{ marginTop: 20 }}>
                    <ExplainerHeader style={{ marginBottom: 10 }}>Current ability</ExplainerHeader>
                    <ExplainerText>Changes to current ability will change the intensity of the workouts you'll be doing, and the terminology used to describe them</ExplainerText>
                </View>
                <View style={{ marginTop: 20 }}>
                    <ExplainerHeader style={{ marginBottom: 10 }}>Report an injury</ExplainerHeader>
                    <ExplainerText>Sabio will ask you questions about your injury, based on your answers Sabio will either provide you with physio exercises to help you recover or suggest you visit a professional</ExplainerText>
                </View>
                <View style={{ marginTop: 20 }}>
                    <ExplainerHeader style={{ marginBottom: 10 }}>Chronic conditions</ExplainerHeader>
                    <ExplainerText>If you have a chronic condition, you can let Sabio know about it here. This will help Sabio to plan workouts that are safe for you to do</ExplainerText>
                </View>
                <View style={{ marginTop: 20 }}>
                    <ExplainerHeader style={{ marginBottom: 10 }}>Training preferences</ExplainerHeader>
                    <ExplainerText>Sabio will consider your preferences when planning workouts, for example if you prefer to use a particular piece of equipment, Sabio will try to include it in your plan</ExplainerText>
                </View>
                <View style={{ marginTop: 20 }}></View>
            </View>
        </Container>
    )
}

export default Profile