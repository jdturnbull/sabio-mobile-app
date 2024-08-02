import React from "react";
import { View, TouchableOpacity } from "react-native";
import styled from "styled-components";
import Title from "../../../../../../components/shared/Title";
import SubHeader from "../../../../../../components/shared/SubHeader";
import Add from '../../../../../../assets/icons/18x/AddOutlined';

const NewButton = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.backgroundLight1};
    border: ${(props) => `1px solid ${props.theme.colors.borderHighlight}`};
    padding: 15px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const NewButtonText = styled.Text`
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
`;

const StartScreen = ({ handleNext }) => {
    return (
        <View>
            <Title style={{ marginTop: 10 }}>How does Sabio help with injuries?</Title>
            <SubHeader style={{ marginBottom: 20 }}>Depending on your injury Sabio will either assign you a rehabilitation plan or recommend you to see a doctor</SubHeader>
            <SubHeader style={{ marginBottom: 20 }}>If you are assigned a rehabilitation plan, you will be provided with exercises to help you recover. Once you have, Sabio eases you back into your original plan, with the option to extend the completion date</SubHeader>
            <SubHeader style={{ marginBottom: 20 }}>Sabio's guidance should be taken in conjunction with professional advice, rehabilitation is a complex process and if you are unsure about your recovery, it is best to consult a professional</SubHeader>
            <NewButton onPress={handleNext}>
                <NewButtonText>Report an injury to Sabio</NewButtonText>
                <Add />
            </NewButton>
        </View>
    )
}

export default StartScreen;