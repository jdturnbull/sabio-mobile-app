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

const ManagePlan = () => {
    return (
        <Container>
            <View style={{ marginTop: 10 }}>
                <ExplainerHeader style={{ marginBottom: 10 }}>Sabio allows you to create multiple plans, for example you may have a half marathon plan, and a plan to improve your flexibility</ExplainerHeader>
                <ExplainerText>As a subscribed user, you can create a maximum of 3 plans and switch between them with ease. When a plan finishes, it won't count towards your three plan limit</ExplainerText>
            </View>
        </Container>
    )
}

export default ManagePlan