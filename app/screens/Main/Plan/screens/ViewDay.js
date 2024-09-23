import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components/native';
import moment from 'moment-timezone';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, TouchableOpacity, ActivityIndicator, Alert, Dimensions, Text, ScrollView } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import Title from '../../../../components/shared/Title';
import call from '../../../../utils/call';
import { hapticImpact } from '../../../../utils/haptics';
import ChatIcon from '../../../../assets/icons/24x/Chat';
import Repeat from '../../../../assets/icons/18x/Repeat';
import Help from '../../../../assets/icons/18x/Help';
import Tick from '../../../../assets/icons/18x/Tick';
import { updateState } from '../../../../stores/user/userSlice';
import SwipeToAction from '../../../../components/shared/SwipeToAction';
import { Animated } from 'react-native';
import retrieveCompletion from '../../../../utils/retrieveCompletion';
import { usePostHog } from 'posthog-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #16171b;
  padding-top: 20px;
  padding-horizontal: 20px;
`;

const ActivityContainer = styled.View`
  background-color: ${(props) => props.theme.colors.background2};
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

const NumberText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: 24px;
  font-weight: ${(props) => props.theme.text.weight.bold};
`;

const HeaderText = styled.Text`
  color: ${(props) => props.theme.text.colors.white};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.xs};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.bold};
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

const EmojiText = styled.Text``;

const ChatButton = styled(TouchableOpacity)`
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const OptionButton = styled(TouchableOpacity)`
  background-color: #A1AAD315;
  padding: 8px;
  border-radius: 8px;
  margin-right: 10px;
  flex-direction: row;
  align-items: center;
`;

const OptionText = styled.Text`
  color: #f8f8f8;
  font-weight: ${(props) => props.theme.text.weight.bold};
  margin-left: 5px;
`;

const SpinningRepeat = (props) => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    )
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Repeat {...props} />
    </Animated.View>
  );
};

const ViewDay = ({ fetchActivities }) => {
  const posthog = usePostHog();
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const confettiRef = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [proposedChanges, setProposedChanges] = useState([]);
  const [prevProposedChanges, setPrevProposedChanges] = useState([]);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    posthog.capture('viewed_day', { is_today: moment(date).isSame(moment.tz(user.timezone), 'day') });
  }, []);

  const training_plans = useSelector((state) => state.user.training_plans);
  const training_plan = training_plans.filter((p) => p.status === 'ACTIVE')[0];

  const { _day, week } = route.params;
  const { day, date, activities } = _day;

  const [complete, setComplete] = useState(activities.every(activity => activity.status === 'COMPLETE'));
  const showBottomQuestionButton = !moment(activities[0].date).isBefore(moment()) || complete;

  const handleBack = () => {
    if (!isProcessing) {
      setIsProcessing(true);
      navigation.goBack();
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const handleComplete = async () => {
    const { training_plan_id } = _day.activities[0];
    hapticImpact();
    confettiRef.current.start();
    await call('POST', 'users/completeDay', { planId: training_plan_id, date: _day.date })
    posthog.capture('completed_day', { day: day, date: _day.date });
  };

  const handleChat = async () => {
    // If they are subscribed, just send them straight to the chat
    if (user?.subscription_status === 'SUBSCRIBED') {
      posthog.capture('used_premium_feature', { feature: 'day_chat', was_trial: false });
      navigation.navigate('Chat', { day, week, fetchActivities });
      posthog.capture('activity_chat_button_pressed', { day: day, week: week });
      return;
    }

    // If they are not subscribed, check if they are more than two weeks old

    const accountMoreThanTwoWeeksOld = moment().isAfter(moment(user?.created_at).add(2, 'weeks'));

    // They are not more than two weeks old, so send them straight to the chat
    if (!accountMoreThanTwoWeeksOld) {
      posthog.capture('used_premium_feature', { feature: 'day_chat', was_trial: true });
      navigation.navigate('Chat', { day, week, fetchActivities });
      return;
    }

    // They are more than two weeks old, so check if they have used their free question this week

    const thisWeekNumber = moment().week().toString();
    const lastFreeQuestionAt = await AsyncStorage.getItem('lastFreeQuestionAt') || 0;

    if (thisWeekNumber === lastFreeQuestionAt) {
      posthog.capture('tried_to_use_premium_feature', { feature: 'day_chat', was_trial: false });
      // They have used their free question this week, so show the modal
      dispatch(updateState({
        showSubscribeModal: true,
        subscribeModalTriggeredFrom: 'Chat'
      }));
    } else {
      // They have not used their free question this week, so show the alert
      Alert.alert('You can ask one free question a week', 'To use your free weekly question, confirm below.', [
        {
          text: 'Cancel', onPress: () => { }
        },
        {
          text: 'Confirm', onPress: async () => {
            posthog.capture('used_premium_feature', { feature: 'day_chat', was_trial: false, was_free: true });
            // Set the last free question at to this week
            await AsyncStorage.setItem('lastFreeQuestionAt', moment().week().toString());
            // Send them to the chat
            navigation.navigate('Chat', { day, week, fetchActivities });
          }
        }
      ]);
    }
  }

  const handleChangeActivity = async () => {
    if (user.subscription_status === 'SUBSCRIBED') {
      posthog.capture('used_premium_feature', { feature: 'day_activity_quick_change', was_trial: false });
      posthog.capture('activity_change_button_pressed', { day: day, week: week });
      setProposedChanges([]);
      setIsChanging(true);
      return;
    }

    // They are not subscribed, so check if their account is more than two weeks old
    const accountMoreThanTwoWeeksOld = moment().isAfter(moment(user?.created_at).add(2, 'weeks'));

    // If their account is less than two weeks old, allow them to change the activities
    if (!accountMoreThanTwoWeeksOld) {
      posthog.capture('used_premium_feature', { feature: 'day_activity_quick_change', was_trial: true });
      posthog.capture('activity_change_button_pressed', { day: day, week: week });
      setProposedChanges([]);
      setIsChanging(true);
      return;
    }

    // If their account is more than two weeks old, check if they have used their free quick change this week
    const thisWeekNumber = moment().week().toString();
    const lastFreeChangeAt = await AsyncStorage.getItem('lastFreeChangeAt') || 0;

    if (thisWeekNumber === lastFreeChangeAt) {
      posthog.capture('tried_to_use_premium_feature', { feature: 'day_activity_quick_change', was_trial: false });
      // They have used their free quick change this week, so show the modal
      dispatch(updateState({
        showSubscribeModal: true,
        subscribeModalTriggeredFrom: 'View day activity quick change'
      }))
      return;
    }

    // They have not used their free quick change this week, so show the alert
    Alert.alert('You have one free quick change a week', 'To use your free quick change, confirm below.', [
      {
        text: 'Cancel', onPress: () => { }
      },
      {
        text: 'Confirm', onPress: async () => {
          posthog.capture('used_premium_feature', { feature: 'day_activity_quick_change', was_trial: false, was_free: true });
          await AsyncStorage.setItem('lastFreeChangeAt', moment().week().toString());
          posthog.capture('activity_change_button_pressed', { day: day, week: week });
          setProposedChanges([]);
          setIsChanging(true);
        }
      }
    ]);
  }

  useEffect(() => {
    const runIsChanging = async () => {
      let prompt = `You are a fitness instructor, you have assigned your client workout(s) for the day however your client has requested to change these activities. Here are the workout(s) you've assigned the client:\n\n`
      prompt += `{workouts: [\n`

      for (let i = 0; i < activities.length; i++) {
        prompt += `{'id': ${activities[i].id}, 'title': ${activities[i].title}, 'details': ${activities[i].details}, 'icon': ${activities[i].icon}}\n`
      }

      prompt += `]}\n\n`;

      prompt += `Your task is to assign the client with a different set of workouts, the new workouts should achieve the same percieved goal as the existing workouts.\n`;
      prompt += `Here is the client's weekly focus: ${week.focus}\n`
      prompt += `Here is the client's fitness goal: ${training_plan.goal}\n`

      if (training_plan?.plan?.client_information?.equipment_facilities) {
        prompt += `Here is some of the client's preffered equipment & facilities (you can also assign them activities not using these):\n`
        prompt += `${training_plan.plan.client_information.equipment_facilities}\n\n`
      }

      if (prevProposedChanges.length > 0) {
        prompt += `You've already attempted to assign the client alternate workouts however they've rejected these, here are the alternate workouts you suggested:\n`

        for (let i = 0; i < prevProposedChanges.length; i++) {
          prompt += `Title: ${prevProposedChanges[i].title}, details: ${prevProposedChanges.details}\n`
        }

        prompt += `\n\n`;
      }

      prompt += `You must return the same number of workouts as shown in the workouts initially assigned to the client.\n`;
      prompt += `You MUST NOT change the id of the workout\n`;

      prompt += `You must respond in JSON using the format: {workouts: []}`;

      try {
        const response = await retrieveCompletion({ prompt, json: true });
        const { workouts } = JSON.parse(response);

        setProposedChanges(workouts);
        setPrevProposedChanges(workouts);
        setIsChanging(false);

        const new_activities = activities.map((activity) => {
          const matchingChange = workouts.filter((p) => p.id === activity.id)[0];
          return {
            ...activity,
            ...matchingChange
          }
        });

        await call('POST', 'users/changeDayActivities', { new_activities })
        await fetchActivities();

      } catch (error) {
        setProposedChanges([]);
        setIsChanging(false);
      }
    }

    if (isChanging) runIsChanging();
  }, [isChanging])

  return (
    <Container>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity style={{ padding: 8 }} onPress={handleBack}><ArrowLeft /></TouchableOpacity>
        <Title style={{ marginBottom: 0, marginLeft: 10, flex: 1 }}>{moment(date).format('ddd, MMMM Do')}</Title>
        <ChatButton onPress={handleChat}><ChatIcon /></ChatButton>
      </View>
      {activities.map((activity, i) => {
        return (
          <ActivityContainer key={activity.id}>
            <ActivityHeader color={'#A1AAD315'}>
              <HeaderText>Session</HeaderText>
            </ActivityHeader>
            <ActivityBody>
              {activities.length > 1 && <><Left>
                <NumberText>{i + 1}</NumberText>
              </Left>
                <View style={{ marginLeft: 6, marginRight: 12, width: 2, backgroundColor: '#f8f8f810', height: '100%', borderRadius: 50 }} /></>}
              <Right>
                {!isChanging && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <EmojiText>{proposedChanges.length > 0 ? proposedChanges[i].icon : activity.icon}</EmojiText>
                  <ActivityTitle>{proposedChanges.length > 0 ? proposedChanges[i].title : activity.title}</ActivityTitle>
                </View>}
                {isChanging &&
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <ActivityIndicator />
                  </View>}
                {!isChanging && <ActivityBodyText>{proposedChanges.length > 0 ? proposedChanges[i].details : activity.details}</ActivityBodyText>}
              </Right>
            </ActivityBody>
          </ActivityContainer>
        )
      })}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {complete || !showBottomQuestionButton && <OptionButton onPress={handleChat}>
          <Help />
          <OptionText>Ask a question</OptionText>
        </OptionButton>}
        {!complete && <OptionButton onPress={handleChangeActivity}>
          {isChanging ? (
            proposedChanges.length === 0 ? (
              <SpinningRepeat />
            ) : (
              <Tick />
            )
          ) : (
            <Repeat />
          )}
          <OptionText>{activities.length > 1 ? 'Change activities' : 'Change activity'}</OptionText>
        </OptionButton>}
      </View>
      {!complete && !showBottomQuestionButton &&
        <SwipeToAction action={handleComplete} />
      }
      {showBottomQuestionButton && <OptionButton style={{ margin: 0, marginVertical: 20, width: '100%', justifyContent: 'center', height: 40, backgroundColor: '#f8f8f8' }} onPress={handleChat}>
        <Help color={'#16171b'} />
        <OptionText style={{ color: '#16171b' }}>Ask a question</OptionText>
      </OptionButton>}
      <View style={{ height: 20 }} />
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        ref={confettiRef}
      />

    </Container>
  );
}

export default ViewDay;

// TODO NEXT: HOOK PROFILE CHANGES INTO PLAN