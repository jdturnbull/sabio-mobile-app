import React, { useState } from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-paper';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../components/shared/Title';
import SubHeader from '../../components/shared/SubHeader';
import NextButton from '../../components/shared/NextButton';
import { update } from '../../stores/user/userSlice';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #16171b;
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 50px;
`;

const HeaderText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;


const OptionText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;


const NotificationSettings = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [isProcessing, setIsProcessing] = useState(false);

    const [socialNotifications, setSocialNotifications] = useState(user.notification_settings.social_notifications);
    const [actionsNotifications, setActionsNotifications] = useState(user.notification_settings.actions_notifications);
    const [progressNotifications, setProgressNotifications] = useState(user.notification_settings.progress_notifications);
    const [motivationNotifications, setMotivationNotifications] = useState(user.notification_settings.motivation_notifications);



    const handleBack = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            navigation.goBack();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    const handleNext = () => {
        let notifications_enabled = false;
        if (socialNotifications || actionsNotifications || progressNotifications || motivationNotifications) {
            notifications_enabled = true;
        }

        dispatch(update({
            userId: user.id,
            data: {
                notification_settings: {
                    ...user.notification_settings,
                    social_notifications: socialNotifications,
                    actions_notifications: actionsNotifications,
                    progress_notifications: progressNotifications,
                    motivation_notifications: motivationNotifications,
                    notifications_enabled: notifications_enabled,
                },
                notifications_enabled: notifications_enabled,
            }
        }))
    };

    return (
        <Container>
            <Header>
                <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}>
                    <ArrowLeft />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        marginRight: 32,
                        alignItems: 'center',
                    }}>
                    <HeaderText>Notification Settings</HeaderText>
                </View>
            </Header>
            <View style={{ marginTop: 20 }}>
                <SubHeader>We'd like to send you notifications to keep you motivated and on track.</SubHeader>
            </View>
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
            <View style={{ flex: 1 }} />
            <NextButton editMode={true} onPress={handleNext} />
        </Container>
    );
};

export default NotificationSettings;