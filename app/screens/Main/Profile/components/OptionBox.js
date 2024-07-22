import React from "react";
import styled from "styled-components";
import { TouchableOpacity } from "react-native";
import ArrowRight from '../../../../assets/icons/18x/ArrowRight';

const Container = styled(TouchableOpacity)`
    border-radius: 10px;
    padding: 10px;
    background-color: ${(props) => props.theme.colors.background2};
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-vertical: 5px;
    height: 50px;
`;

const LabelText = styled.Text`
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    flex: 1;
`;


const OptionBox = ({ label, onPress, Icon }) => {

    const handlePress = () => onPress(label);

    return (
        <Container onPress={handlePress}>
            <LabelText>{label}</LabelText>
            {!Icon ? <ArrowRight /> : <Icon />}
        </Container>
    )
}

export default OptionBox; 