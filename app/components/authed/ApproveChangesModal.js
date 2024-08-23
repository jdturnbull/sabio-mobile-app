import React, { useEffect } from "react";
import { Dimensions, View, TouchableOpacity, Image, ScrollView } from "react-native";
import moment from 'moment';
import styled from 'styled-components';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from "react-redux";
import Close from '../../assets/icons/24x/Clear';
import { update, updateState } from '../../stores/user/userSlice';
import { usePostHog } from "posthog-react-native";
import Title from '../../components/shared/Title';
import BodyText from '../../components/shared/BodyText';
import SubHeader from "../shared/SubHeader";
import call from "../../utils/call";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ModalContent = styled.View`
    flex: 1;
    justify-content: flex-end;
`;

const ModalInnerContent = styled.View`
    height: ${props => props.height}px;
    width: ${screenWidth}px;
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    padding: 20px;
    shadow-color: #000;
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 3.84px;
`;

const ActivityContainer = styled.View`
  background-color: ${(props) => props.theme.colors.background3};
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ActivityHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  background-color: ${(props) => props.color};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ActivityBody = styled.View`
  margin-vertical: 10px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 10px;
`;

const Left = styled.View`
  width: 30px;
  justify-content: center;
  align-items: center;
`;

const Right = styled.View`
  flex: 1;
`;

const ActivityTitle = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  margin-left: 5px;
`;

const ActivityBodyText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  color: ${(props) => props.theme.text.colors.grey};
  font-size: ${(props) => props.theme.text.size.sm};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.regular};
`;

const HeaderText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.xs};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.bold};
  flex: 1;
`;

const NumberText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: 24px;
  font-weight: ${(props) => props.theme.text.weight.bold};
`;

const EmojiText = styled.Text``;

const ChangeItem = ({ change, i }) => {
    const { new_activity, old_activity } = change;

    return (
        <View>
            <ActivityTitle style={{ marginBottom: 15 }}>{moment(old_activity.date).format('dddd DD MMMM')}</ActivityTitle>
            <ActivityContainer style={{ opacity: 0.5, marginBottom: 10 }}>
                <ActivityHeader color={'#A1AAD315'}>
                    <HeaderText>Previous Activity</HeaderText>
                </ActivityHeader>
                <ActivityBody>
                    <Left>
                        <NumberText>{i + 1}</NumberText>
                    </Left>
                    <View style={{ marginLeft: 6, marginRight: 12, width: 2, backgroundColor: '#f8f8f810', height: '100%', borderRadius: 50 }} />
                    <Right>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <EmojiText>{old_activity.icon}</EmojiText>
                            <ActivityTitle>{old_activity.title}</ActivityTitle>
                        </View>
                        <ActivityBodyText>{old_activity.details}</ActivityBodyText>
                    </Right>
                </ActivityBody>
            </ActivityContainer>
            <ActivityContainer>
                <ActivityHeader color={'#A1AAD3'}>
                    <HeaderText>New Activity</HeaderText>
                </ActivityHeader>
                <ActivityBody>
                    <Left>
                        <NumberText>{i + 1}</NumberText>
                    </Left>
                    <View style={{ marginLeft: 6, marginRight: 12, width: 2, backgroundColor: '#f8f8f810', height: '100%', borderRadius: 50 }} />
                    <Right>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <EmojiText>{new_activity.icon}</EmojiText>
                            <ActivityTitle>{new_activity.title}</ActivityTitle>
                        </View>
                        <ActivityBodyText>{new_activity.details}</ActivityBodyText>
                    </Right>
                </ActivityBody>
            </ActivityContainer>
        </View>

    )
}

const ApproveChangesModal = ({ handleClose }) => {
    const user = useSelector(state => state.user?.user);
    const dispatch = useDispatch();
    const posthog = usePostHog();

    const changes = user?.replan_changes?.changes;

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 100) {
            handleClose();
        }
    };

    const handleReject = () => {
        handleClose();
    };

    const handleApprove = async () => {
        try {
            await call('GET', `users/approveReplanChanges/${user.id}`);
            dispatch(update({
                userId: user.id,
                data: {
                    replan_changes: {},
                    should_replan: false
                }
            }));
            handleClose();
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler style={{ flex: 1 }} onGestureEvent={handleGesture}>
                <ModalContent>
                    <ModalInnerContent height={changes?.length > 0 ? screenHeight * 0.8 : 300}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title>Sabio analysed your changes</Title>
                            <TouchableOpacity onPress={handleClose}>
                                <Close />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 0 }}>
                            <SubHeader>{user?.replan_changes?.change_description || 'Here are the changes Sabio would like to make to your plan'}</SubHeader>
                        </View>
                        {!changes?.length && <View style={{ flex: 1, paddingTop: 40 }}>
                            <BodyText>Sabio has decided no changes to your plan are needed.</BodyText>
                        </View>}
                        {changes?.length > 0 && <ScrollView style={{ flex: 1, marginTop: 20, marginBottom: 20 }} showsVerticalScrollIndicator={false}>
                            {changes.map((change, index) => <ChangeItem key={change.id} i={index} change={change} />)}
                        </ScrollView>}
                        {changes?.length > 0 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={handleReject} style={{ width: '48%', backgroundColor: '#A1AAD315', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 10, marginRight: 5 }}>
                                <BodyText style={{ color: '#fff', fontWeight: 500 }}>{changes?.length > 0 ? 'No thanks' : 'Close'}</BodyText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleApprove} style={{ width: '48%', backgroundColor: '#EE6E12', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 10, marginLeft: 5 }}>
                                <BodyText style={{ fontWeight: 600, color: '#fff' }}>I like it</BodyText>
                            </TouchableOpacity>
                        </View>}
                        {!changes?.length && <TouchableOpacity onPress={handleClose} style={{ width: '100%', backgroundColor: '#A1AAD315', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 10, marginTop: 10 }}>
                            <BodyText style={{ color: '#fff', fontWeight: 500 }}>Close</BodyText>
                        </TouchableOpacity>}
                    </ModalInnerContent>
                </ModalContent>
            </PanGestureHandler>
        </GestureHandlerRootView>

    );
};

export default ApproveChangesModal;