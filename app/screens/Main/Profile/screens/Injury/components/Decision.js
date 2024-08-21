import React, { useState } from "react";
import { Alert, View } from "react-native";
import styled from "styled-components";
import Title from "../../../../../../components/shared/Title";
import SubHeader from "../../../../../../components/shared/SubHeader";
import BodyText from "../../../../../../components/shared/BodyText";
import CustomInput from "../../../../../../components/shared/CustomInput";
import NextButton from "../../../../../../components/shared/NextButton";
import { useDispatch, useSelector } from "react-redux";
import { createRehabPlan, setup } from "../../../../../../stores/user/userSlice";
import { usePostHog } from "posthog-react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Container = styled(KeyboardAwareScrollView)`
    flex: 1;
`;

const Decision = ({ hasLockedFeeling, hasFullRangeOfMotion, checkedByProfessional, location }) => {
    const posthog = usePostHog();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const [canTrain, setCanTrain] = useState(() => {
        if (checkedByProfessional) {
            return true;
        }
        posthog.capture('rehab_plan_decision', { canCreateRehabPlan: !hasLockedFeeling && hasFullRangeOfMotion, hasLockedFeeling, hasFullRangeOfMotion, checkedByProfessional });
        return !hasLockedFeeling && hasFullRangeOfMotion;
    });

    const [description, setDescription] = useState('');

    const title = canTrain ? "It's time to enter injury mode" : "We can't help you with this injury";
    const subtitle = canTrain ? "Here's how Sabio's injury mode works" : "Based on your answers we recommend you stop training and contact a professional to discuss your injury.";

    const howInjuryModeWorks = "Sabio will assign you physio exercises to help you recover from your injury, when you're ready to train again, you can exit injury mode and Sabio will ease you back into your plan. You can stay on your current plan, or create a new one. We strongly recommend you not rely soley on Sabio's advice, and also consult a professional.";

    const handleSubmit = () => {
        if (!description) {
            Alert.alert('Please describe your injury');
            return;
        }

        dispatch(createRehabPlan({ userId: user.id, description, location }));
        posthog.capture('rehab_plan_create', { description, location });
    };

    return (
        <Container showsVerticalScrollIndicator={false} extraScrollHeight={130}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            keyboardOpeningTime={0}>
            <Title>{title}</Title>
            <SubHeader>{subtitle}</SubHeader>
            {canTrain ? <BodyText style={{ marginVertical: 20 }}>{howInjuryModeWorks}</BodyText> : <BodyText style={{ marginTop: 20 }}>We have deemed this injury too severe for Sabio to help with.</BodyText>}
            {canTrain && <BodyText>To continue, please describe your {location.toLowerCase()} injury in the best detail possible, including:</BodyText>}
            {canTrain && (
                <View style={{ marginVertical: 20 }}>
                    <BodyText>• Severity of the pain</BodyText>
                    <BodyText>• Impact on movement and functionality</BodyText>
                    <BodyText>• Any swelling or bruising</BodyText>
                    <BodyText>• Any previous history of this injury</BodyText>
                </View>
            )}
            {canTrain && <View style={{ marginTop: 20, flex: 1, justifyContent: 'space-between' }}>
                <CustomInput placeholder={`Include as much detail as possible`} label={`Your description`} value={description} setValue={setDescription} multiline={true} />
                <NextButton onPress={handleSubmit} />
            </View>}
        </Container>
    )
}

export default Decision;