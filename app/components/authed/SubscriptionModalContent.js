import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Dimensions, ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import PremiumLarge from '../../assets/icons/48x/Premium';
import Close from '../../assets/icons/24x/Clear';
import Tick from '../../assets/icons/24x/TickOutline';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { getAvailablePurchases, requestSubscription, validateReceiptIos, useIAP } from 'react-native-iap';
import { useDispatch, useSelector } from "react-redux";
import { update, updateState } from "../../stores/user/userSlice";
import { usePostHog } from "posthog-react-native";
import { getCurrencyFromTimezone } from "../../utils/timezones";
import call from "../../utils/call";


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const FEATURES = ['Adjust plan based on changes to equipment, ability, preferences and more', 'Guidance on injury management, workout details and best practices', 'Enhance Sabio with your Strava data to increase personalisation and coaching quality', 'Create and switch between multiple training plans']

const ModalContent = styled.View`
    flex: 1;
    justify-content: flex-end;
`;

const ModalInnerContent = styled.View`
    height: ${screenHeight * 0.85}px;
    width: ${screenWidth}px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 20px;
    shadow-color: #000;
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 3.84px;
`;

const SubscriptionContent = styled(ScrollView)`
    flex: 1;
    padding-horizontal: 1px;
    flex-direction: column;
    padding-bottom: 20px;
`;

const ModalHeaderText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.lg};
    margin-top: 10px;
`;

const ModalBodyText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.md};
    margin-top: 5px;
`;

const OptionsContainer = styled.View`
    flex: 1;
    flex-direction: column;
    margin-top: 5px;
    width: 100%;
`;

const OptionBox = styled(TouchableOpacity)`
    width: 100%;
    background-color: ${(props) => props.selected ? '#49548A80' : '#49548A30'};
    padding: 10px;
    border-radius: 10px;
    border: ${(props) => props.selected ? '1px solid #49548A' : '1px solid #49548A30'};
`;

const OptionMainText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: 18px;
`;

const OptionSubText = styled.Text`
    color: ${(props) => props.theme.text.colors.grey};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.sm};
`;

const FloatingButton = styled(TouchableOpacity)`
    position: absolute;
    bottom: 30px;
    left: 20px;
    right: 20px;
    background-color: ${(props) => props.theme.text.colors.white};
    padding: 15px;
    border-radius: 10px;
    align-items: center;
`;

const FloatingButtonText = styled.Text`
    color: #000;
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
`;

const BulletPoint = ({ text }) => {
    return (
        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20, alignItems: 'center' }}>
            <Tick color={'#EE6E12'} />
            <View style={{ marginLeft: 15 }}>
                <ModalBodyText style={{ marginTop: 0 }}>{text}</ModalBodyText>
            </View>
        </View>
    )
}

const SubscriptionModalContent = () => {
    const posthog = usePostHog();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.user);
    const triggeredFrom = useSelector((state) => state.user.subscribeModalTriggeredFrom);
    const [selectedOption, setSelectedOption] = useState('Annual');
    const [currency, setCurrency] = useState(getCurrencyFromTimezone(user.timezone));


    useEffect(() => {
        if (showSubscribeModal) {
            posthog.capture('viewed_subscribe_modal', { source: triggeredFrom });
        }
    }, [])

    // NOTE: Can use getAvailablePurchases validateReceiptIos to check if the user has an active subscription already

    const { getSubscriptions } = useIAP();

    const handleSubscribe = async () => {
        try {
            await getSubscriptions({ skus: ['annual', 'monthly'] });

            if (selectedOption === 'Annual') {
                await requestSubscription({ sku: 'annual' });
            } else {
                await requestSubscription({ sku: 'monthly' });
            }
        } catch (error) {
            posthog.capture('request_subscription_error', { error });
        }
    };

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 100) {
            posthog.capture('closed_subscribe_modal', { source: triggeredFrom });
            dispatch(updateState({ showSubscribeModal: false }));
        }
    };

    const PRICES = {
        'GBP': {
            'Annual': { total: '£99.99/year', perWeek: '£1.92' },
            'Monthly': { total: '£14.99/month', perWeek: '£3.45' },
        },
        'USD': {
            'Annual': { total: '$128.99/year', perWeek: '$2.48' },
            'Monthly': { total: '$19.99/month', perWeek: '$4.44' },
        },
        'EUR': {
            'Annual': { total: '€117.99/year', perWeek: '€2.26' },
            'Monthly': { total: '€17.99/month', perWeek: '€4.05' },
        },
        'CAD': {
            'Annual': { total: '$175.99/year', perWeek: '$3.38' },
            'Monthly': { total: '$26.99/month', perWeek: '$6.22' },
        }
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler style={{ flex: 1 }} onGestureEvent={handleGesture}>
                <ModalContent>
                    <ModalInnerContent>
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => {
                                posthog.capture('closed_subscribe_modal', { source: triggeredFrom });
                                dispatch(updateState({ showSubscribeModal: false }))
                            }}>
                                <Close />
                            </TouchableOpacity>
                        </View>
                        <SubscriptionContent showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                            <PremiumLarge />
                            <ModalHeaderText>Join Sabio Premium</ModalHeaderText>
                            <ModalBodyText>Unlock Sabio's full potential</ModalBodyText>
                            <View style={{ marginVertical: 20, padding: 10 }}>
                                {FEATURES.map((feature, index) => (
                                    <BulletPoint key={index} text={feature} />
                                ))}
                            </View>
                            <OptionsContainer>
                                <OptionBox selected={selectedOption === 'Annual'} onPress={() => setSelectedOption('Annual')}>
                                    <View id="top" style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                        <OptionMainText style={{ flex: 1 }}>Annual</OptionMainText>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <View style={{ backgroundColor: '#EE6E12', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 }}>
                                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Save 55%</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View id="bottom" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <OptionSubText>{PRICES[currency]['Annual']['total']}</OptionSubText>
                                        <OptionSubText>{PRICES[currency]['Annual']['perWeek']}/week</OptionSubText>
                                    </View>
                                </OptionBox>
                                <OptionBox style={{ marginTop: 20 }} selected={selectedOption === 'Monthly'} onPress={() => setSelectedOption('Monthly')}>
                                    <OptionMainText>Monthly</OptionMainText>
                                    <View id="bottom" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <OptionSubText>{PRICES[currency]['Monthly']['total']}</OptionSubText>
                                        <OptionSubText>{PRICES[currency]['Monthly']['perWeek']}/week</OptionSubText>
                                    </View>
                                </OptionBox>
                            </OptionsContainer>
                            <View style={{ height: 100 }} />
                        </SubscriptionContent>
                        <FloatingButton onPress={handleSubscribe}>
                            <FloatingButtonText>SUBSCRIBE</FloatingButtonText>
                        </FloatingButton>
                    </ModalInnerContent>
                </ModalContent>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
};

export default SubscriptionModalContent;