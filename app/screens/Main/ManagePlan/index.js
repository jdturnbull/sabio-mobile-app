import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity, ScrollView, Modal, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../../assets/icons/24x/ArrowLeft';
import OptionBox from '../../../components/authed/OptionBox';
import AddOutlined from '../../../assets/icons/24x/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import NewPlanConfirm from './components/NewPlanConfirm';
import TrainingPlanCard from './components/TrainingPlanCard';
import { activatePlan, updateState } from '../../../stores/user/userSlice';
import InfoButton from '../../../components/shared/InfoButton';
import { usePostHog } from 'posthog-react-native';

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
    const posthog = usePostHog();
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const user = useSelector((state) => state.user.user);
    const training_plans = useSelector((state) => state.user.training_plans);
    const training_plan = training_plans.find(plan => plan.status === "ACTIVE");
    const expired_plans = training_plans.filter((plan) => plan.status === 'EXPIRED');

    const [prevActive, setPrevActive] = useState(training_plan);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleBack = () => {
        navigation.goBack();
    };

    const handlePress = (opt) => {
        if (opt === 'Add a new plan') {
            posthog.capture('add_new_plan_confirm_open');
            setModalContent(<NewPlanConfirm handleClose={() => setModalVisible(false)} />);
            setModalVisible(true);
        }
    }

    const handleActivate = (planId) => {
        const accountMoreThanTwoWeeksOld = moment().isAfter(moment(user?.created_at).add(2, 'weeks'));

        if (user?.subscription_status === 'SUBSCRIBED' || !accountMoreThanTwoWeeksOld) {
            posthog.capture('used_premium_feature', { feature: 'switch_plans', was_trial: accountMoreThanTwoWeeksOld ? false : true });
            posthog.capture('activate_plan', { planId });
            setLoading(true);
            setModalVisible(false);
            setTimeout(() => {
                setLoading(false);
                dispatch(activatePlan({ userId: user.id, planId }));
                navigation.navigate('Plan');
            }, 500);
        } else {
            posthog.capture('tried_to_use_premium_feature', { feature: 'switch_plans', });
            dispatch(updateState({ showSubscribeModal: true, subscribeModalTriggeredFrom: 'Manage plan' }));
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
                <TouchableOpacity onPress={handleBack} style={{ padding: 8 }}>
                    <ArrowLeft />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        marginRight: 32,
                        alignItems: 'center',
                    }}>
                    <HeaderText>Manage Plans</HeaderText>
                </View>
                <InfoButton location={"Manage Plan"} small />
            </Header>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="medium" color="#f8f8f8" />
                </View>
            ) : (
                <Main>
                    {training_plan && <View style={{ marginVertical: 20 }}><TrainingPlanCard plan={training_plan} handleActivate={handleActivate} /></View>}
                    <OptionBox label={'Add a new plan'} onPress={handlePress} Icon={AddOutlined} hideEndIcon />
                    {training_plans.length > 1 && <TrainingPlanList>
                        {training_plans.filter(plan => plan.status === "ARCHIVED" || plan.status === "INACTIVE").length > 0 && <HeaderText style={{ fontWeight: 400 }}>Switchable Plans</HeaderText>}
                        {training_plans.filter(plan => plan.status === "INACTIVE").map((plan) => (
                            <TrainingPlanCard key={plan.id} plan={plan} handleActivate={handleActivate} />
                        ))}
                        {training_plans.filter(plan => plan.status === "ARCHIVED").map((plan) => (
                            <TrainingPlanCard key={plan.id} plan={plan} handleActivate={handleActivate} />
                        ))}
                    </TrainingPlanList>}
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