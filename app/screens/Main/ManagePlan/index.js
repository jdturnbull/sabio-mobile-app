import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity, ScrollView, Modal, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../../assets/icons/24x/ArrowLeft';
import OptionBox from '../../../components/authed/OptionBox';
import Clock from '../../../assets/icons/24x/Clock';
import Repeat from '../../../assets/icons/24x/Repeat';
import AddOutlined from '../../../assets/icons/24x/AddOutlined';
import DateInput from '../../../components/shared/DateInput';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import NewPlanConfirm from './components/NewPlanConfirm';
import TrainingPlanCard from './components/TrainingPlanCard';
import { activatePlan, updateState } from '../../../stores/user/userSlice';

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

const Main = styled(ScrollView)`
  flex: 1;
  margin-top: 30px;
`;

const TrainingPlanList = styled.View`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const ManagePlan = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const user = useSelector((state) => state.user.user);
    const training_plans = useSelector((state) => state.user.training_plans);
    const training_plan = training_plans.find(plan => plan.status === "ACTIVE");
    const [prevActive, setPrevActive] = useState(training_plan);

    const [date, setDate] = useState(training_plan?.start_date);
    const [showDateInput, setShowDateInput] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const height = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value, { duration: 300 }),
    }));

    const handleBack = () => {
        navigation.goBack();
    };

    const handlePress = (opt) => {
        if (opt === 'Add a new plan') {
            setModalContent(<NewPlanConfirm handleClose={() => setModalVisible(false)} />);
            setModalVisible(true);
        }
        if (opt === 'Change plan duration') {
            setShowDateInput((prev) => !prev);
            height.value = showDateInput ? 0 : 320;
        }
    }

    const handleActivate = (planId) => {
        if (user.subscription_status === 'SUBSCRIBED') {
            setLoading(true);
            setModalVisible(false);
            dispatch(activatePlan({ userId: user.id, planId }));
        } else {
            dispatch(updateState({ showSubscribeModal: true }));
        }
    }

    useEffect(() => {
        if (prevActive !== training_plan) {
            setLoading(false);
            setPrevActive(training_plan);
        }
    }, [training_plan])

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={handleBack} style={{ width: 50 }}>
                    <ArrowLeft />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        marginRight: 50,
                        alignItems: 'center',
                    }}>
                    <HeaderText>Manage Plans</HeaderText>
                </View>
            </Header>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="medium" color="#f8f8f8" />
                </View>
            ) : (
                <Main>
                    <HeaderText style={{ fontWeight: 400, marginBottom: 20 }}>Currently Active Plan</HeaderText>
                    {training_plan && <View style={{ marginBottom: 30 }}><TrainingPlanCard plan={training_plan} handleActivate={handleActivate} /></View>}
                    <OptionBox label={'Add a new plan'} onPress={handlePress} Icon={AddOutlined} hideEndIcon />
                    <OptionBox label={'Change plan duration'} onPress={handlePress} Icon={Clock} hideEndIcon />
                    <Animated.View style={[{ overflow: 'hidden', marginTop: 10 }, animatedStyle]}>
                        <DateInput placeholder={'Start date'} value={date} setValue={setDate} label={'Start date'} alwaysOpen />
                    </Animated.View>
                    <TrainingPlanList>
                        <HeaderText style={{ fontWeight: 400 }}>Switchable Plans</HeaderText>
                        {training_plans.filter(plan => plan.status === "INACTIVE").map((plan) => (
                            <TrainingPlanCard key={plan.id} plan={plan} handleActivate={handleActivate} />
                        ))}
                        {training_plans.filter(plan => plan.status === "ARCHIVED").map((plan) => (
                            <TrainingPlanCard key={plan.id} plan={plan} handleActivate={handleActivate} />
                        ))}
                    </TrainingPlanList>
                </Main>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                {modalContent}
            </Modal>
        </Container>
    );
};

export default ManagePlan;