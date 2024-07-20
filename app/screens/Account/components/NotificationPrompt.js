import React, { useEffect, useState } from "react";
import { Linking, TouchableOpacity } from "react-native";
import styled from "styled-components";

import Bell from '../../../assets/icons/24x/Bell';
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../../stores/user/userSlice";

const Container = styled.View`
    padding: 12px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    margin-vertical: 10px;
`;

const TopRow = styled.View`
    flex-direction: row;
    align-items: center;
`;

const MainText = styled.Text`
    margin-left: 10px;
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
    font-family: ${(props) => props.theme.text.family};
`;

const SubText = styled.Text`
    margin-top: 10px;
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    line-height: 20px;
`;

const ButtonsContainer = styled.View`
    margin-top: 15px;
    flex-direction: row;
    align-items: center;
`;

const TurnOnButton = styled(TouchableOpacity)`
    flex: 1;
    align-items: center;
    background-color: ${(props) => props.theme.colors.white};
    padding: 8px;
    border-radius: 5px;
`;

const SkipButton = styled(TouchableOpacity)`
    flex: 1;
    align-items: center;
`;

const ButtonText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-family: ${(props) => props.theme.text.family};
`;


const NotificationPrompt = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const handleOn = () => Linking.openSettings();

    const handleSkip = () => {
        dispatch(update({ userId: user.id, data: { notification_settings: { ...user.notification_settings, hide_prompt: true } } }));
    };

    return (
        <Container>
            <TopRow>
                <Bell />
                <MainText>Turn on workout notifications</MainText>
            </TopRow>
            <SubText>Help us help you, we can keep you motivated</SubText>
            <ButtonsContainer>
                <SkipButton onPress={handleSkip}>
                    <ButtonText>DISMISS</ButtonText>
                </SkipButton>
                <TurnOnButton onPress={handleOn}>
                    <ButtonText style={{ color: '#000' }}>TURN ON</ButtonText>
                </TurnOnButton>

            </ButtonsContainer>
        </Container>
    )
}

export default NotificationPrompt