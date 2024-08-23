import React, { useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BodyText from "../shared/BodyText";
import { View } from "react-native";
import CustomInput from "../shared/CustomInput";
import Title from "../shared/Title";
import SubHeader from "../shared/SubHeader";
import { useDispatch, useSelector } from "react-redux";
import { addWeeklyCheckin, update } from "../../stores/user/userSlice";
import { usePostHog } from "posthog-react-native";
import moment from "moment";

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
    padding-top: 70px;
`;

const Inner = styled(KeyboardAwareScrollView)`
    margin-top: 20px;
`;

const SubText = styled.Text`
    font-family: ${(props) => props.theme.text.family};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    font-size: ${(props) => props.theme.text.size.xs};
    color: ${(props) => props.theme.text.colors.grey};
    margin-bottom: 10px;
`;

const Button = styled(TouchableOpacity)`
    flex: 1;
    background-color: ${(props) => props.theme.colors.white};
    padding: 10px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
`;

const SkipButton = styled(TouchableOpacity)`
    flex: 1;
    border: 1px solid #f8f8f8;
    padding: 10px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
`;

const ButtonContainer = styled.View`
    position: absolute;
    bottom: 30px;
    left: 20px;
    right: 20px;
`;

const WeeklyCheckinModal = ({ handleClose }) => {
    const posthog = usePostHog();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.user);
    const training_plans = useSelector((state) => state.user.training_plans) || [];
    const training_plan = training_plans?.filter((plan) => plan.status === 'ACTIVE')[0];

    const [exerciseFlowNotWork, setExerciseFlowNotWork] = useState('');
    const [anyLimitations, setAnyLimitations] = useState('');
    const [boredom, setBoredom] = useState('');

    const handleContinue = () => {
        if (!exerciseFlowNotWork && !anyLimitations && !boredom) {
            posthog.capture('weekly_checkin_skip', { exerciseFlowNotWork, anyLimitations, boredom });
            handleClose();
        } else {
            posthog.capture('weekly_checkin_save', { exerciseFlowNotWork, anyLimitations, boredom });
            dispatch(addWeeklyCheckin({ userId: user.id, training_plan_id: training_plan.id, data: { exerciseFlowNotWork, anyLimitations, boredom } }));
            handleClose();
        }
    }

    const handleSkip = () => {
        posthog.capture('weekly_checkin_skip', { exerciseFlowNotWork, anyLimitations, boredom });
        dispatch(addWeeklyCheckin({ userId: user.id, training_plan_id: training_plan.id, data: { exerciseFlowNotWork, anyLimitations, boredom } }));
        handleClose();
    }

    return (
        <Container>
            <Title>Weekly Check-in</Title>
            <SubHeader>Let Sabio know if anything needs changing</SubHeader>
            <Inner extraScrollHeight={100} enableOnAndroid={true} keyboardOpeningTime={0} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ marginTop: 20 }}>
                    <BodyText style={{ fontWeight: 'bold', marginBottom: 5 }}>Exercise flow: Did anything not work?</BodyText>
                    <SubText>Did you find anything wrong or difficult with the assigned exercises?</SubText>
                    <CustomInput placeholder="Optional" value={exerciseFlowNotWork} setValue={setExerciseFlowNotWork} hideLabel />
                </View>
                <View style={{ marginTop: 10 }}>
                    <BodyText style={{ fontWeight: 'bold', marginBottom: 5 }}>Any limitations?</BodyText>
                    <SubText>Is anything outside of your control affecting your training?</SubText>
                    <CustomInput placeholder="Optional" value={anyLimitations} setValue={setAnyLimitations} hideLabel />
                </View>
                <View style={{ marginTop: 10 }}>
                    <BodyText style={{ fontWeight: 'bold', marginBottom: 5 }}>Boredom</BodyText>
                    <SubText>Are there any exercises that are boring or feel repetitive?</SubText>
                    <CustomInput placeholder="Optional" value={boredom} setValue={setBoredom} hideLabel />
                </View>
            </Inner>
            <ButtonContainer>
                <SkipButton onPress={handleSkip}>
                    <BodyText style={{ fontWeight: 500 }}>Skip until next week</BodyText>
                </SkipButton>
                <Button onPress={handleContinue}>
                    <BodyText style={{ color: '#000', fontWeight: 500 }}>Continue</BodyText>
                </Button>
            </ButtonContainer>
        </Container>
    )
}

export default WeeklyCheckinModal;