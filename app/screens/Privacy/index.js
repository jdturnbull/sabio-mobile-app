import React from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity } from 'react-native';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import { useNavigation } from '@react-navigation/native';

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

const Privacy = () => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={handleBack} style={{ width: 50 }}>
                    <ArrowLeft />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        marginRight: 50,
                        alignItems: 'center',
                    }}>
                    <HeaderText>Privacy Settings</HeaderText>
                </View>
            </Header>
        </Container>
    );
};

export default Privacy;