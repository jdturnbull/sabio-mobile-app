import React, { useState } from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-native-paper';
import ArrowLeft from '../../assets/icons/24x/ArrowLeft';
import { update } from '../../stores/user/userSlice';
import NextButton from '../../components/shared/NextButton';

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
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
`;

const Privacy = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);

    const [isProcessing, setIsProcessing] = useState(false);

    const [postAchievementsToSocial, setPostAchievementsToSocial] = useState(user.privacy_settings.post_achievements_to_social);
    const [postActivitiesToSocial, setPostActivitiesToSocial] = useState(user.privacy_settings.post_activities_to_social);
    const [postStreaksToSocial, setPostStreaksToSocial] = useState(user.privacy_settings.post_streaks_to_social);

    const handleBack = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            navigation.goBack();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    const handleAchievementsChange = () => {
        if (postAchievementsToSocial) {
            setPostAchievementsToSocial(false);
        } else {
            setPostAchievementsToSocial(true);

        }
    };

    const handleActivitiesChange = () => {
        if (postActivitiesToSocial) {
            setPostActivitiesToSocial(false);
        } else {
            setPostActivitiesToSocial(true);

        }
    };

    const handleStreaksChange = () => {
        if (postStreaksToSocial) {
            setPostStreaksToSocial(false);
        } else {
            setPostStreaksToSocial(true);
        }
    };

    const handleSave = () => {
        dispatch(update({ userId: user.id, data: { privacy_settings: { ...user.privacy_settings, post_achievements_to_social: postAchievementsToSocial, post_activities_to_social: postActivitiesToSocial, post_streaks_to_social: postStreaksToSocial } } }))
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
                        textAlign: 'center'
                    }}>
                    <HeaderText>Privacy Settings</HeaderText>
                </View>
            </Header>
            <View style={{ marginTop: 30, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <OptionText>Post Streaks to Social</OptionText>
                    <Switch color='#EE6E12' style={{ transform: [{ scale: 0.8 }] }} value={postStreaksToSocial} onValueChange={handleStreaksChange} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <OptionText>Post Achievements to Social</OptionText>
                    <Switch color='#EE6E12' style={{ transform: [{ scale: 0.8 }] }} value={postAchievementsToSocial} onValueChange={handleAchievementsChange} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <OptionText>Post Activities to Social</OptionText>
                    <Switch color='#EE6E12' style={{ transform: [{ scale: 0.8 }] }} value={postActivitiesToSocial} onValueChange={handleActivitiesChange} />
                </View>
            </View>
            <View style={{ flex: 1 }} />
            <NextButton editMode={true} onPress={handleSave}>Save</NextButton>
        </Container>
    );
};

export default Privacy;