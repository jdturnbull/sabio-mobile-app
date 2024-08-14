import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Title from "../../components/shared/Title";
import SubHeader from "../../components/shared/SubHeader";
import { View } from "react-native";
import BodyText from "../../components/shared/BodyText";
import PushNotification from 'react-native-push-notification';
import { Switch } from "react-native-paper";
import NextButton from "../../components/shared/NextButton";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { updateState } from "../../stores/onboarding/onboardingSlice";
import { usePostHog } from "posthog-react-native";

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
    padding: 20px;
`;

const OptionText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const RequestNotifications = () => {
    const posthog = usePostHog();
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const user = useSelector((state) => state.user?.user);
    const [socialNotifications, setSocialNotifications] = useState(true);
    const [actionsNotifications, setActionsNotifications] = useState(true);
    const [progressNotifications, setProgressNotifications] = useState(true);
    const [motivationNotifications, setMotivationNotifications] = useState(true);

    useEffect(() => {
        // They've already setup notifs so we can skip
        if (user?.onboarding_status === 'RESETTING_PLAN' || user?.onboarding_status === 'GENERATING_REHAB_PLAN') {
            navigation.navigate('CreatingPlan');
        }
    }, [])

    const handleNext = async () => {
        PushNotification.requestPermissions().then(async (permissions) => {
            if (permissions.alert || permissions.badge || permissions.sound) {
                const deviceToken = await AsyncStorage.getItem('deviceToken');
                posthog.capture('notifications_approved', { permissions: permissions });
                dispatch(updateState({
                    notification_settings: {
                        social_notifications: socialNotifications,
                        actions_notifications: actionsNotifications,
                        progress_notifications: progressNotifications,
                        motivation_notifications: motivationNotifications,
                        notifications_enabled: true,
                        token: deviceToken,
                    }
                }));

                navigation.navigate('CreatingPlan');
            } else {
                posthog.capture('notifications_denied', { permissions: permissions });
                navigation.navigate('CreatingPlan');
            }
        }).catch((error) => {
            console.error("Error requesting notification permissions: ", error);
            posthog.capture('notifications_request_failed', { error: error.message });
            navigation.navigate('CreatingPlan');
        });
    }

    return (
        <Container>
            <Title>We'd like to send notifications</Title>
            <SubHeader>Letting Sabio send notifications makes it more likley for you to stay on track with your goals.</SubHeader>
            <View style={{ marginTop: 20 }}>
                <BodyText style={{ fontWeight: 600, fontSize: 16 }}>Here's what we might send</BodyText>
                <View style={{ marginTop: 10 }}>
                    <BodyText>• Daily schedule & workout reminders</BodyText>
                    <BodyText style={{ marginTop: 5 }}>• Social post likes (Sabio liked your post)</BodyText>
                    <BodyText style={{ marginTop: 5 }}>• Motivation (Don't lose your workout streak!)</BodyText>
                    <BodyText style={{ marginTop: 5 }}>• Actions (Sabio finished your week)</BodyText>
                </View>
            </View>
            <View style={{ marginTop: 40, flex: 1 }}>
                <BodyText style={{ fontWeight: 600, fontSize: 16, marginBottom: 15 }}>Adjust your notifications settings</BodyText>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
                    <OptionText>Social notifications</OptionText>
                    <Switch color='#EE6E12' style={{ transform: [{ scale: 0.7 }] }} value={socialNotifications} onValueChange={setSocialNotifications} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <OptionText>Actions notifications</OptionText>
                    <Switch color='#EE6E12' style={{ transform: [{ scale: 0.7 }] }} value={actionsNotifications} onValueChange={setActionsNotifications} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <OptionText>Progress notifications</OptionText>
                    <Switch color='#EE6E12' style={{ transform: [{ scale: 0.7 }] }} value={progressNotifications} onValueChange={setProgressNotifications} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <OptionText>Motivation notifications</OptionText>
                    <Switch color='#EE6E12' style={{ transform: [{ scale: 0.7 }] }} value={motivationNotifications} onValueChange={setMotivationNotifications} />
                </View>
            </View>
            <NextButton onPress={handleNext} />
        </Container>
    )
}

export default RequestNotifications;