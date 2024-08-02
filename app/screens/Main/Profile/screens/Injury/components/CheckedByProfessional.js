import React from "react";
import styled from "styled-components";
import Title from "../../../../../../components/shared/Title";
import { TouchableOpacity, View } from "react-native";
import SubHeader from "../../../../../../components/shared/SubHeader";

const Container = styled.View`
    flex: 1;
`;

const Button = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.background2};
    padding: 10px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    margin-vertical: 5px;
`;

const ButtonText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    font-size: ${(props) => props.theme.text.size.sm};
`;

const CheckedByProfessional = ({ handleNext, setCheckedByProfessional }) => {

    const handleYes = () => {
        setCheckedByProfessional(true);
        handleNext(true);
    }

    const handleNo = () => {
        setCheckedByProfessional(false);
        handleNext(false);
    }

    return (
        <Container>
            <Title style={{ marginTop: 10, marginBottom: 20 }}>Has a medical professional said you can exercise?</Title>
            <View style={{ marginTop: 20 }}>
                <Button onPress={handleYes}>
                    <ButtonText>Yes</ButtonText>
                </Button>
                <Button onPress={handleNo}>
                    <ButtonText>No</ButtonText>
                </Button>
            </View>
        </Container>
    );
};

export default CheckedByProfessional;