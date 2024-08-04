import React from "react";
import styled from "styled-components";
import BodyText from "../../components/shared/BodyText";
import moment from "moment";
import { View } from "react-native";

const Container = styled.View`
    background-color: ${(props) => props.theme.colors.background2};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
`;

const TimeText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.sm};
    color: ${(props) => props.theme.text.colors.white};
`;

const Notification = ({ notification }) => {
    const timeText = moment(notification.created_at).fromNow();
    return (
        <Container>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <BodyText>{notification.title}</BodyText>
            </View>
            <View style={{ marginTop: 10 }}>
                <BodyText>{notification.body}</BodyText>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TimeText>{timeText}</TimeText>
            </View>
        </Container>
    )
};

export default Notification;