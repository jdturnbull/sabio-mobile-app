import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_APPLE_PASSWORD } from '@env';
import Premium from '../../../assets/icons/24x/Premium';
import { update, updateState } from "../../../stores/user/userSlice";
import { getAvailablePurchases, validateReceiptIos } from "react-native-iap";
import call from "../../../utils/call";
import { usePostHog } from "posthog-react-native";

const Container = styled.View`
    padding: 12px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    margin-vertical: 10px;
`;

const TopRow = styled.View`
    flex-direction: row;
    align-items: center;
`;

const MainText = styled.Text`
    margin-left: 10px;
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
`;

const SubText = styled.Text`
    margin-top: 10px;
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    line-height: 20px;
`;

const ButtonsContainer = styled.View`
    margin-top: 15px;
    flex-direction: row;
    align-items: center;
`;

const TurnOnButton = styled(TouchableOpacity)`
    flex: 1;
    align-items: center;
    background-color: ${(props) => props.theme.text.colors.white};
    padding: 8px;
    border-radius: 5px;
`;

const SkipButton = styled(TouchableOpacity)`
    flex: 1;
    align-items: center;
`;

const ButtonText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
`;


const SubscribePrompt = () => {
    const dispatch = useDispatch();
    const posthog = usePostHog();
    const user = useSelector((state) => state.user?.user);

    const handleOpen = () => {
        dispatch(updateState({ showSubscribeModal: true, subscribeModalTriggeredFrom: 'Subscribe' }));
    };

    const handleRestore = async () => {
        posthog.capture('restore_subscription_pressed');
        const previousPurchases = await getAvailablePurchases();

        if (!previousPurchases.length) {
            posthog.capture('no_previous_subscriptions');
            return;
        }

        let hasActiveSubscription = false;
        let activePurchase = null;

        posthog.capture('has_previous_subscriptions');

        for (let x = 0; x < previousPurchases.length; x++) {
            const purchase = previousPurchases[x];
            const validatedReceipt = await validateReceiptIos({
                receiptBody: {
                    'receipt-data': purchase.transactionReceipt,
                    'password': REACT_APP_APPLE_PASSWORD
                },
                isTest: process.env.NODE_ENV !== 'production'
            });

            if (!validatedReceipt) continue;

            if (validatedReceipt.status === 0) {
                hasActiveSubscription = true;
                activePurchase = purchase;
                break;
            }
        }

        if (hasActiveSubscription) {
            posthog.capture('has_active_subscription', { purchase: activePurchase });
            const response = await call('POST', 'users/confirmSubscription', { userId: user?.id, purchase: activePurchase });

            if (response === 'EXPIRED') {
                posthog.capture('previous_subscription_expired', { purchase: activePurchase });
                Alert.alert('Subscription expired', 'Please renew your subscription in Apple settings or press subscribe. Email support@heysabio.com if you have any questions.');
            } else {
                posthog.capture('subscription_restored', { purchase: activePurchase });
                dispatch(update({ userId: user.id, data: { subscription_status: 'SUBSCRIBED' } }));
                dispatch(updateState({ showSubscribeModal: false, showNewSubscriptionWelcome: true }));
            }


        } else {
            Alert.alert('No active subscription found', 'If you have any questions, please contact support@heysabio.com');
            dispatch(updateState({ showSubscribeModal: true, subscribeModalTriggeredFrom: 'Restore' }));
        }
    };

    return (
        <Container>
            <TopRow>
                <Premium />
                <MainText>Join Sabio Premium</MainText>
            </TopRow>
            <SubText>Unlock the rest of your weeks and enhance your fitness journey!</SubText>
            <ButtonsContainer>
                <SkipButton onPress={handleRestore}>
                    <ButtonText>RESTORE</ButtonText>
                </SkipButton>
                <TurnOnButton onPress={handleOpen}>
                    <ButtonText style={{ color: '#000' }}>SUBSCRIBE</ButtonText>
                </TurnOnButton>
            </ButtonsContainer>
        </Container>
    )
}

export default SubscribePrompt