import React, { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import moment from "moment-timezone";
import BodyText from "../shared/BodyText";
import { useDispatch, useSelector } from "react-redux";
import { activatePlan, addNewPlan, setup } from "../../stores/user/userSlice";

const Container = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

const Inner = styled.View`
    width: ${Dimensions.get("window").width - 40}px;
    background-color: ${(props) => props.theme.colors.background2};
    padding: 20px;
    border-radius: 10px;
`;

const Button = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.background3};
    padding: 10px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;

const PlanExpiredModal = ({ handleClose }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const training_plans = useSelector((state) => state.user.training_plans);
    const [achievedGoal, setAchievedGoal] = useState('');

    const training_plan = training_plans?.find((plan) => plan.status === 'ACTIVE') || null;
    const alternate_plans = training_plans?.filter((plan) => plan.status === 'ARCHIVED' && plan.end_date > moment().tz(user.timezone).format('YYYY-MM-DD')) || [];

    const hasAlternatePlans = alternate_plans.length > 0;

    const handlePress = (v) => setAchievedGoal(v);

    const handleSwitch = (id) => {
        dispatch(activatePlan({ userId: user.id, planId: id, prevPlanId: training_plan.id, prevExpired: true, achievedGoal }));
        handleClose();
        navigation.navigate('Plan');
    };

    const handleNew = () => {
        dispatch(addNewPlan({ userId: user.id, planId: training_plan.id, hasExpired: true, achievedGoal }));
        handleClose();
    };

    return (
        <Container>
            <Inner>
                <BodyText style={{ fontWeight: "bold", marginBottom: 10 }}>Your training plan has finished!</BodyText>
                {achievedGoal === '' ? (
                    <View>
                        <BodyText>Did you achieve your goal?</BodyText>
                        <View style={{ marginTop: 20 }}>
                            <Button style={{ marginBottom: 10 }} onPress={() => handlePress('yes')}>
                                <BodyText>Yes</BodyText>
                            </Button>
                            <Button onPress={() => handlePress('no')}>
                                <BodyText>No</BodyText>
                            </Button>
                        </View>
                    </View>
                ) : (
                    <View>
                        <BodyText>{hasAlternatePlans ? 'Select one of your existing plans, or create a new one' : 'Thank you for training with Sabio, press below to start a new plan'}</BodyText>
                        <Button style={{ marginTop: 10 }} onPress={handleNew}>
                            <BodyText>Start a new plan</BodyText>
                        </Button>
                        {hasAlternatePlans && <View style={{ marginTop: 10 }}>
                            <BodyText>Switch to one of your existing plans</BodyText>
                        </View>}
                        {hasAlternatePlans && (
                            <View style={{ marginTop: 10 }}>
                                {alternate_plans.map((plan) => (
                                    <Button key={plan.id} onPress={() => handleSwitch(plan.id)}>
                                        <BodyText>{plan.name}</BodyText>
                                    </Button>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </Inner>
        </Container >
    );
};

export default PlanExpiredModal;