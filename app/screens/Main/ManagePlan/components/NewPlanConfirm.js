import React from 'react';
import styled from 'styled-components';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { View, TouchableOpacity, Dimensions } from "react-native";
import Close from '../../../../assets/icons/18x/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPlan } from '../../../../stores/user/userSlice';
import { usePostHog } from 'posthog-react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')


const ModalContent = styled.View`
    flex: 1;
    justify-content: flex-end;
`;

const ModalInnerContent = styled.View`
    height: 220px;
    width: ${screenWidth}px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 20px;
    shadow-color: ${(props) => props.theme.colors.background1};
    shadow-offset: 0px 0px;
    shadow-opacity: 0.4;
    shadow-radius: 3.84px;
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

const Content = styled.View`
    flex: 1;
    flex-direction: column;
    padding-vertical: 20px;
`;

const ModalHeaderText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.bold};
    font-size: ${(props) => props.theme.text.size.md};
`;

const ModalBodyText = styled.Text`
    color: ${(props) => props.theme.text.colors.white};
    font-weight: ${(props) => props.theme.text.weight.regular};
    font-size: ${(props) => props.theme.text.size.md};
    margin-top: 10px;
`;

const getBodyText = (status, plansLeft) => {
    if (status === 'SUBSCRIBED' && plansLeft === 2) {
        return 'You have 1/3 plans currently active';
    }
    if (status === 'SUBSCRIBED' && plansLeft === 1) {
        return 'Are you sure? This will be the last plan you can create';
    }
    if (status === 'SUBSCRIBED' && plansLeft === 0) {
        return 'You have reached the maximum number of plans allowed';
    }

    if (status === 'UNSUBSCRIBED' && plansLeft > 0) {
        return "Are you sure? You will only be able to switch between plans as a Sabio Premium member.";
    }
    if (status === 'UNSUBSCRIBED' && plansLeft === 0) {
        return 'You have reached the maximum number of plans allowed';
    }
}



const NewPlanConfirm = ({ handleClose }) => {
    const posthog = usePostHog();
    const dispatch = useDispatch();
    const state = useSelector(state => state.user);
    const user = state.user;
    const training_plans = state.training_plans;
    const training_plan = training_plans.filter((p) => p.status === 'ACTIVE')[0];

    const plansLeft = 3 - training_plans.length;

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 100) {
            handleClose();
        }
    };

    const handleConfirm = () => {
        if (plansLeft > 0) {
            posthog.capture('add_new_plan', { plansLeft: plansLeft });
            dispatch(addNewPlan({ userId: user.id, planId: training_plan.id }));
        } else {
            posthog.capture('plan_limit_reached', { plansLeft: plansLeft });
            handleClose();
        }
    }

    const bodyText = getBodyText(user.subscription_status, plansLeft);


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <ModalContent>
                    <ModalInnerContent disabled={plansLeft === 0}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <ModalHeaderText>Add a new plan</ModalHeaderText>
                            <TouchableOpacity onPress={handleClose}>
                                <Close />
                            </TouchableOpacity>
                        </View>
                        <Content>
                            <ModalBodyText>{bodyText}</ModalBodyText>
                        </Content>
                        {plansLeft > 0 && <FloatingButton onPress={handleConfirm}>
                            <FloatingButtonText>Confirm</FloatingButtonText>
                        </FloatingButton>}
                        <FloatingButton onPress={handleConfirm}>
                            <FloatingButtonText>{plansLeft > 0 ? 'Confirm' : 'Close'}</FloatingButtonText>
                        </FloatingButton>
                    </ModalInnerContent>
                </ModalContent>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
};

export default NewPlanConfirm;