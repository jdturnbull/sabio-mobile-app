import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity, View } from "react-native";

import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import Title from "../../components/shared/Title";
import SubHeader from "../../components/shared/SubHeader";
import { useNavigation, useRoute } from "@react-navigation/native";

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
    padding-top: 70px;
`;

const RearrangeWeek = ({ navigation, route }) => {
    const { week } = route.params;

    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10 }}>Rearrange Week {1}</Title>
            </View>
            <SubHeader style={{ marginBottom: 20 }}>Drag activities into certain days to rearrange your week</SubHeader>
        </Container>
    )
};

export default RearrangeWeek;