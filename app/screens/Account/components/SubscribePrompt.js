import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import Premium from '../../../assets/icons/24x/Premium';
import { updateState } from "../../../stores/user/userSlice";

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
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
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
    background-color: ${(props) => props.theme.text.colors.white};
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
`;




const SubscribePrompt = () => {
    const dispatch = useDispatch();

    const handleOpen = () => {
        dispatch(updateState({ showSubscribeModal: true, subscribeModalTriggeredFrom: 'Subscribe' }));
    };

    const handleRestore = () => { };

    return (
        <Container>
            <TopRow>
                <Premium />
                <MainText>Join Sabio Premium</MainText>
            </TopRow>
            <SubText>Unlock the rest of your weeks and enhance your fitness journey!</SubText>
            <ButtonsContainer>
                <SkipButton onPress={handleRestore}>
                    <ButtonText>RESTORE</ButtonText>
                </SkipButton>
                <TurnOnButton onPress={handleOpen}>
                    <ButtonText style={{ color: '#000' }}>SUBSCRIBE</ButtonText>
                </TurnOnButton>
            </ButtonsContainer>
        </Container>
    )
}

export default SubscribePrompt