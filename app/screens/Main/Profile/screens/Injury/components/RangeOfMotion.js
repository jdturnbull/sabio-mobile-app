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

const RangeOfMotion = ({ handleNext, setHasFullRangeOfMotion }) => {

    const handleYes = () => {
        setHasFullRangeOfMotion(true);
        handleNext(false);
    }
    const handleNo = () => {
        setHasFullRangeOfMotion(false);
        handleNext(false);
    }

    return (
        <Container>
            <Title style={{ marginTop: 10, marginBottom: 20 }}>Do you have full range of motion?</Title>
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

export default RangeOfMotion;