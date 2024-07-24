import React from "react";
import styled from "styled-components";
import Sabio from '../../../../assets/icons/32x/SabioArmUp';


const Container = styled.View`
    flex-direction: row;
    margin-bottom: 20px;
`;

const Left = styled.View`
`;

const SabioContainer = styled.View`
    height: 40px;
    width: 40px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
`;

const Right = styled.View`
    flex: 1;
    margin-left: 10px;
`;

const MessageContainer = styled.View`
    background-color: ${(props) => props.theme.colors.background2};
    padding: 10px;
    border-radius: 10px;
`;

const MessageText = styled.Text`
    font-size: ${(props) => props.theme.text.size.sm};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    color: ${(props) => props.theme.colors.white};
`;

const SabioMessage = ({ focus }) => {
    return (
        <Container>
            <Left>
                <SabioContainer>
                    <Sabio />
                </SabioContainer>
            </Left>
            <Right>
                <MessageContainer>
                    <MessageText>
                        {focus}
                    </MessageText>
                </MessageContainer>
            </Right>
        </Container>
    )
}

export default SabioMessage;