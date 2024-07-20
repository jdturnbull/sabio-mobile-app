import React from "react";
import styled from 'styled-components';
import { useSelector } from "react-redux";

import ProfileIcon from '../../../assets/icons/48x/Profile';

const Container = styled.View`
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const NameText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
    color: ${(props) => props.theme.text.colors.white};
    margin-top: 10px;
    margin-bottom: 10px;
`;

const Top = () => {
    const user = useSelector((state) => state.user.user);
    return (
        <Container>
            <ProfileIcon />
            <NameText>{user?.first_name} {user?.second_name}</NameText>
        </Container>
    )
}

export default Top;