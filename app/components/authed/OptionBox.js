import React from "react";
import styled from "styled-components";
import { TouchableOpacity } from "react-native";
import ArrowRight from '../../assets/icons/18x/ArrowRight';

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

const IconContainer = styled.View`
    width: 24px;
    height: 24px;
    margin-right: 10px;
`;

const LabelText = styled.Text`
    font-size: ${(props) => props.theme.text.size.md};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    flex: 1;
`;


const OptionBox = ({ label, Icon, onPress, hideEndIcon, EndIcon }) => {

    const handlePress = () => onPress(label);

    return (
        <Container onPress={handlePress}>
            <IconContainer>
                <Icon />
            </IconContainer>
            <LabelText>{label}</LabelText>
            {!hideEndIcon && !EndIcon && <ArrowRight />}
            {!hideEndIcon && EndIcon && <EndIcon />}
        </Container>
    )
}

export default OptionBox; 