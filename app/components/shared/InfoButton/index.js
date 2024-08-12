import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TouchableOpacity, Modal, View, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import InfoIcon from '../../../assets/icons/24x/Info';
import InfoIconSmall from '../../../assets/icons/20x/Info';
import Title from '../Title';
import Account from './content/Account';
import ManagePlan from './content/ManagePlan';
import Plan from './content/Plan';
import PlanOverview from './content/PlanOverview';
import Profile from './content/Profile';

const InnerView = styled.View`
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    margin-top: 22px;
`;

const ModalView = styled(Animated.View)`
    width: 100%;
    height: ${(props) => props.height};
    background-color: ${(props) => props.theme.colors.background2};
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 20px;
    shadow-color: #000;
    shadow-offset: {
        width: 0;
        height: 2px;
    };
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 5;
`;

const ModalContentContainer = styled(ScrollView)`
    flex: 1;
    width: 100%;
`;

const CONTENT_SWITCH = (location) => {
    switch (location) {
        case 'Account':
            return Account;
        case 'Manage Plan':
            return ManagePlan;
        case 'Plan':
            return Plan;
        case 'Plan Overview':
            return PlanOverview;
        case 'Profile':
            return Profile;
        default:
            return Plan;
    }
};

const MODAL_HEIGHTS = {
    'Manage Plan': '50%',
    'Plan': '88%',
    'Plan Overview': '40%',
    'Profile': '85%',
    'default': '88%'
};

const InfoButton = ({ showInfo, location, small }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const infoButtonOpacity = useSharedValue(1);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (showInfo) {
            infoButtonOpacity.value = withRepeat(
                withTiming(0.2, {
                    duration: 600,
                    easing: Easing.inOut(Easing.ease),
                }),
                -1,
                true
            );
        }
    }, [showInfo]);

    const infoButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: infoButtonOpacity.value,
        };
    });

    const modalStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const handlePress = () => {
        translateY.value = 0; // Reset translateY when modal is opened
        setModalVisible(true);
    };

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 0) {
            translateY.value = event.nativeEvent.translationY;
        }
    };

    const handleGestureEnd = (event) => {
        if (event.nativeEvent.translationY > 100) {
            setModalVisible(false);
        } else {
            translateY.value = withTiming(0);
        }
    };

    const Content = CONTENT_SWITCH(location);
    const modalHeight = MODAL_HEIGHTS[location] || MODAL_HEIGHTS['default'];

    return (
        <>
            <TouchableOpacity
                style={{ padding: 3, backgroundColor: '#A1AAD3', borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
                onPress={handlePress}
            >
                <Animated.View style={infoButtonStyle}>
                    {small ? <InfoIconSmall color={'#fff'} /> : <InfoIcon color={'#fff'} />}
                </Animated.View>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <PanGestureHandler style={{ flex: 1 }} onGestureEvent={handleGesture} onHandlerStateChange={handleGestureEnd}>
                    <InnerView>
                        <ModalView style={modalStyle} height={modalHeight}>
                            <Title>{`Using the ${location} screen`}</Title>
                            <ModalContentContainer showsVerticalScrollIndicator={false}>
                                <Content />
                            </ModalContentContainer>
                        </ModalView>
                    </InnerView>
                </PanGestureHandler>
            </Modal>
        </>
    );
};

export default InfoButton;