import React, { useEffect } from "react";
import { Dimensions, View, TouchableOpacity, Image } from "react-native";
import styled from 'styled-components';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { useDispatch } from "react-redux";
import Close from '../../assets/icons/24x/Clear';
import { updateState } from '../../stores/user/userSlice';
import { usePostHog } from "posthog-react-native";
import Title from '../../components/shared/Title';
import Trophy from '../../assets/trophy.png';
import BodyText from '../../components/shared/BodyText';


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ModalContent = styled.View`
    flex: 1;
    justify-content: flex-end;
`;

const ModalInnerContent = styled.View`
    height: 400px;
    width: ${screenWidth}px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 20px;
    shadow-color: #000;
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 3.84px;
`;

const ShowSubscriptionWelcomeModal = () => {
    const dispatch = useDispatch();
    const posthog = usePostHog();

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 100) {
            posthog.capture('closed_subscription_welcome_modal');
            dispatch(updateState({ showNewSubscriptionWelcome: false }));
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler style={{ flex: 1 }} onGestureEvent={handleGesture}>
                <ModalContent>
                    <ModalInnerContent>
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => {
                                posthog.capture('closed_subscription_welcome_modal');
                                dispatch(updateState({ showNewSubscriptionWelcome: false }))
                            }}>
                                <Close />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
                            <Image source={Trophy} style={{ width: 273, height: 190 }} />
                            <Title>Welcome to Sabio Premium!</Title>
                            <BodyText style={{ textAlign: 'center' }}>You now have access to all features of Sabio, if you need help with anything please reach out to support@heysabio.com</BodyText>
                        </View>
                    </ModalInnerContent>
                </ModalContent>
            </PanGestureHandler>
        </GestureHandlerRootView>

    );
};

export default ShowSubscriptionWelcomeModal;