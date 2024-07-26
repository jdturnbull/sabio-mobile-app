import React, { useState } from "react";
import styled from "styled-components";
import { Dimensions, ScrollView, View, Text, TouchableOpacity } from "react-native";
import PremiumLarge from '../../assets/icons/48x/Premium';
import Close from '../../assets/icons/24x/Clear';
import Tick from '../../assets/icons/24x/TickOutline';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import {
    initConnection,
    requestSubscription,
    purchaseErrorListener,
    purchaseUpdatedListener,
    useIAP,
} from 'react-native-iap';
import { useDispatch } from "react-redux";
import { updateState } from "../../stores/user/userSlice";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const FEATURES = ['Guidance on injury management, workout details and best practices', 'Enhance Sabio with your Strava data to increase personalisation and coaching quality', 'Access to entire plan and advanced progress tracking']

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

const SubscriptionContent = styled.View`
    flex: 1;
    flex-direction: column;
    padding-vertical: 20px;
    align-items: center;  
`;

const ModalHeaderText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.lg};
    margin-top: 20px;
`;

const ModalBodyText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.md};
    margin-top: 10px;
`;

const OptionsContainer = styled.View`
    flex: 1;
    flex-direction: column;
    margin-top: 20px;
    width: 100%;
`;

const OptionBox = styled(TouchableOpacity)`
    width: 100%;
    background-color: #49548A30;
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
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState('Annual');

    const handleSubscribe = async () => {
    };

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 100) {
            dispatch(updateState({ showSubscribeModal: false }));
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <ModalContent>
                    <ModalInnerContent>
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => dispatch(updateState({ showSubscribeModal: false }))}>
                                <Close />
                            </TouchableOpacity>
                        </View>
                        <SubscriptionContent>
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
                                        <OptionSubText>£99.99/year</OptionSubText>
                                        <OptionSubText>£1.92/week</OptionSubText>
                                    </View>
                                </OptionBox>
                                <OptionBox style={{ marginTop: 20 }} selected={selectedOption === 'Monthly'} onPress={() => setSelectedOption('Monthly')}>
                                    <OptionMainText>Monthly</OptionMainText>
                                    <View id="bottom" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <OptionSubText>£14.99/month</OptionSubText>
                                        <OptionSubText>£3.45/week</OptionSubText>
                                    </View>
                                </OptionBox>
                            </OptionsContainer>

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