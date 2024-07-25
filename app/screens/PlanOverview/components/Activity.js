import React from "react";
import styled from "styled-components";
import moment from 'moment';
import getIconFromActivity from "../../../utils/getIconFromActivity";

const DAY_COLOR_MAP = {
    'Monday': '#885A89',
    'Tuesday': '#D4B483',
    'Wednesday': '#355834',
    'Thursday': '#6D466B',
    'Friday': '#FF8585',
    'Saturday': '#134074',
    'Sunday': '#FF3357',
}

const Container = styled.View`
    flex-direction: row;
    align-items: center;  
    margin-top: 10px;
`;

const Left = styled.View``;

const Right = styled.View`
    flex-direction: row;
    align-items: center;
`;

const CompletedIndicator = styled.View`
    width: 15px;
    height: 15px;
    border-radius: 4px;
    margin-right: 8px;
    border: ${(props) => props.complete ? `2px solid ${props.color}` : '2px solid #A1AAD315'};
    background-color: ${(props) => props.complete ? props.color : 'transparent'};
`;

const TitleText = styled.Text`
    margin-left: 8px;
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.complete ? '#f8f8f8' : props.theme.text.colors.darkGrey};
`;

const Activity = ({ activity }) => {

    const Icon = getIconFromActivity(activity.icon, true);

    const complete = activity.status === 'COMPLETE';

    const day = moment(activity.date).format('dddd');

    return (
        <Container>
            <Left>
                <CompletedIndicator complete={complete} color={DAY_COLOR_MAP[day]} />
            </Left>
            <Right>
                <Icon color={complete ? '#f8f8f8' : '#f8f8f840'} />
                <TitleText complete={complete}>{activity.title}</TitleText>
            </Right>
        </Container>
    )
}

export default Activity;