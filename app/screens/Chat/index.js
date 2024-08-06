import React, { useState } from "react";
import styled from "styled-components";
import { View, TouchableOpacity } from 'react-native';

import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #16171b;
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 50px;
`;

const HeaderText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const Chat = () => {
    const navigation = useNavigation();
    const [isProcessing, setIsProcessing] = useState(false);


    const handleBack = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            navigation.goBack();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    return (
        <Container>
            <Header>
                <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}>
                    <ArrowLeft />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        marginRight: 32,
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                    <HeaderText>Chat with Sabio</HeaderText>
                </View>
            </Header>
        </Container>
    )
}

export default Chat;