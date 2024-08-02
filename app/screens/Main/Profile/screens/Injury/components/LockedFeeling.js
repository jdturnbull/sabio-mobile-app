import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import Title from "../../../../../../components/shared/Title";

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

const LockedFeeling = ({ handleNext, setHasLockedFeeling }) => {

    const handleYes = () => {
        setHasLockedFeeling(true);
        handleNext(true);
    }
    const handleNo = () => {
        setHasLockedFeeling(false);
        handleNext(false);
    }

    return (
        <Container>
            <Title style={{ marginTop: 10, marginBottom: 20 }}>Do you have stuck or locked feeling?</Title>
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

export default LockedFeeling;