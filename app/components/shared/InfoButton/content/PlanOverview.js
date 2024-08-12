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

const PlanOverview = () => {
    return (
        <Container>
            <View style={{ marginTop: 10 }}>
                <ExplainerHeader style={{ marginBottom: 10 }}>The plan overview screen shows your entire plan from start to finish</ExplainerHeader>
                <ExplainerText>You can use this screen to get an understanding for what you'll be doing in the coming weeks, and to see your progression through the plan</ExplainerText>
            </View>
        </Container>
    )
}

export default PlanOverview