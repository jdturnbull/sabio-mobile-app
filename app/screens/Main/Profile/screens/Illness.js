import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { TouchableOpacity, View, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import Title from '../../../../components/shared/Title';
import SubHeader from '../../../../components/shared/SubHeader';
import call from '../../../../utils/call';
import { updateState } from '../../../../stores/user/userSlice';
import mascotIll from '../../../../assets/mascot/ill.png';

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
`;

const Button = styled(TouchableOpacity)`
    background-color: ${(props) => props.theme.colors.white};
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    height: 45px;
`;

const ButtonText = styled.Text`
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.black};
    font-weight: 500;
    text-align: center;
    width: 100%;
`;

const Mascot = styled.Image`
`;

const PausedView = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [stage, setStage] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [fadeAnim] = useState(new Animated.Value(1));
    const user = useSelector((state) => state.user?.user);
    const training_plans = useSelector((state) => state.user?.training_plans);
    const training_plan = training_plans.find((plan) => plan.status === 'ACTIVE');
    const goal_date = moment(training_plan.end_date).format('DD MMM YYYY');

    const today = moment();
    const paused_at = moment(user.account_paused_at);
    // const days_paused = today.diff(paused_at, 'days');
    const days_paused = 2;
    const new_end_date = moment(training_plan.end_date).add(days_paused, 'days');
    const dates_during_pause = [];

    for (let i = 0; i <= days_paused; i++) {
        const date = moment(paused_at).add(i, 'days');
        if (!date.isSame(today, 'day')) {
            dates_during_pause.push(date.format('DD MMM YYYY'));
        }
    }

    const questions = {
        1: [
            { id: 1, label: `Keep my goal date (${goal_date})` },
            { id: 2, label: `Extend my goal date (${new_end_date.format('DD MMM YYYY')})` }
        ],
        2: [
            { id: 3, label: "Don't change my activities" },
            { id: 4, label: "Optimise my activities" }
        ],
    }

    useEffect(() => {
        setStage(days_paused > 0 ? 1 : 2);
    }, [days_paused]);

    const handleOptionPress = (id) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setSelectedOptions([...selectedOptions, id]);

            if (id === 1 || id === 2) setStage(2);
            if (id === 3) setStage(4);
            if (id === 4) setStage(3);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    }

    const handleNoDaysMissed = async () => {
        await call('POST', 'users/handleIllness', {
            userId: user?.id,
            pause: false,
            noDaysMissed: true
        });

        dispatch(updateState({ user: { ...user, account_paused: false, account_paused_at: null } }));
    }

    return (
        <View style={{ flex: 1 }}>
            <Title>Your training is paused</Title>
            <SubHeader>{dates_during_pause.length === 0 ? "When you're ready to resume training, press the button below." : 'Select an option below to resume your training'}</SubHeader>
            <View style={{ flex: 1, marginTop: 40 }}>
                {dates_during_pause.length === 0 ? (
                    <Button onPress={handleNoDaysMissed}>
                        <ButtonText>Resume training</ButtonText>
                    </Button>
                ) : (
                    <View>
                        <Animated.View style={{ opacity: fadeAnim }}>
                            {questions[stage]?.map((option) => (
                                <View key={option.id} style={{ marginBottom: 10 }}>
                                    <Button onPress={() => handleOptionPress(option.id)}>
                                        <ButtonText>{option.label}</ButtonText>
                                    </Button>
                                </View>
                            ))}
                        </Animated.View>
                        {stage === 4 && <Title>Here's what Sabio will do</Title>}
                        {/* TODO: add what sabio will do here */}
                        {/* TODO: add button with handleResumeTraining */}
                    </View>
                )}
            </View>
        </View>
    )
};

const DefaultView = ({ handlePauseTraining }) => (
    <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
            <Title>It's time to rest</Title>
            <SubHeader style={{ marginBottom: 20, marginTop: 10 }}>We all get ill from time to time, if you are unwell, press the button below to pause your training.</SubHeader>
            <SubHeader>When you feel better, Sabio will replan for you to get your fitness back on track.</SubHeader>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Mascot source={mascotIll} style={{ width: 150, height: 202 }} />
            </View>
        </View>
        <Button onPress={handlePauseTraining}>
            <ButtonText>Pause</ButtonText>
        </Button>
    </View>
);


// TODO: acccount_paused state not saving properly

const Illness = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const [accountPaused, setAccountPaused] = useState(user?.account_paused);

    useEffect(() => {
        setAccountPaused(user?.account_paused);
    }, [user?.account_paused]);

    console.log(accountPaused);

    const fromPausedModal = route.params?.fromPausedModal;

    const handleBack = () => {
        if (fromPausedModal) {
            navigation.navigate('Profile', { screen: 'View' });
        } else {
            navigation.goBack();
        }
    };

    const handlePauseTraining = async () => {
        const { paused_at } = await call('POST', 'users/handleIllness', {
            userId: user?.id,
            pause: true
        });
        dispatch(updateState({ user: { ...user, account_paused: true, account_paused_at: paused_at } }));
        setAccountPaused(true);
    };

    return (
        <Container>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>
                <Title style={{ marginBottom: 0, marginLeft: 10 }}>{accountPaused ? 'Resume your training' : 'Report an illness'}</Title>
            </View>
            {accountPaused ? <PausedView /> : <DefaultView handlePauseTraining={handlePauseTraining} />}
        </Container>
    );
};

export default Illness;