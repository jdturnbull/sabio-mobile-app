import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import Premium from '../../../../assets/icons/14x/Premium';
import { useSelector } from "react-redux";

const Container = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 10px;
    margin-top: ${(props) => props.active ? '0px' : '20px'};
`;

const Top = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const TopText = styled.Text`
    color: ${(props) => props.theme.text.colors.grey};
    font-size: ${(props) => props.theme.text.size.xs};
`;

const StatusBox = styled.View`
    background-color: ${(props) => props.status === 'ACTIVE' ? props.theme.colors.primary : props.theme.colors.background3};
    padding: 5px;
    border-radius: 5px;
`;

const StatusText = styled.Text`
    font-size: 8px;
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.semibold}
`;

const Mid = styled.View`
    margin-vertical: 10px;
`;

const MidText = styled.Text`
color: ${(props) => props.theme.text.colors.white};
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const Touchable = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.highlight};
    padding: 5px;
    border-radius: 5px;
    flex-direction: row;
    align-items: center;
`;

const TouchableText = styled.Text`
    color: ${(props) => props.theme.colors.white};
    font-size: ${(props) => props.theme.text.size.xs};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    margin-left: ${(props) => props.iconExists ? '5px' : '0px'};
`;

const TrainingPlanCard = ({ plan, handleActivate }) => {
    const user = useSelector(state => state.user.user);
    const { goal, end_date, start_date, status } = plan;

    const handlePress = () => handleActivate(plan.id);

    const handleContainerPress = () => {
        if (user.subscription_status === 'SUBSCRIBED' && status === 'ARCHIVED') {
            handlePress();
        }
    }

    return (
        <Container onPress={handleContainerPress} active={status === 'ACTIVE'} disabled={status === 'ACTIVE'}>
            <Top>
                {status === 'ACTIVE' && <TopText style={{ color: '#EE6E12' }}>Currently Active Plan</TopText>}
                <TopText>
                    {plan.plan.client_information.duration}
                </TopText>
                {status !== 'ACTIVE' && <StatusBox status={status}>
                    <StatusText status={status}>
                        {status}
                    </StatusText>
                </StatusBox>}
            </Top>
            <Mid>
                <MidText>{plan.name}</MidText>
            </Mid>
            <ButtonContainer>
                {status === 'ARCHIVED' || status === 'INACTIVE' ? <Touchable onPress={handlePress}>
                    {user.subscription_status !== 'SUBSCRIBED' ? <Premium color={'#fff'} /> : null}
                    <TouchableText iconExists={user.subscription_status !== 'SUBSCRIBED'}>Activate</TouchableText>
                </Touchable> : null}
            </ButtonContainer>
        </Container>
    );
};

export default TrainingPlanCard;