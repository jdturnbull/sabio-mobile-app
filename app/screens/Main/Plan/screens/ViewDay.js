import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, TouchableOpacity, Text, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import Title from '../../../../components/shared/Title';
import call from '../../../../utils/call';
import { hapticImpact } from '../../../../utils/haptics';
import BodyText from '../../../../components/shared/BodyText';
import ChatIcon from '../../../../assets/icons/24x/Chat';
import Repeat from '../../../../assets/icons/18x/Repeat';
import Help from '../../../../assets/icons/18x/Help';
import Tick from '../../../../assets/icons/18x/Tick';
import { updateState } from '../../../../stores/user/userSlice';
import { Animated } from 'react-native';
import retrieveCompletion from '../../../../utils/retrieveCompletion';
import { usePostHog } from 'posthog-react-native';

const DAY_COLOR_MAP = {
  'Monday': '#885A89',
  'Tuesday': '#D4B483',
  'Wednesday': '#355834',
  'Thursday': '#469db9',
  'Friday': '#FF8585',
  'Saturday': '#134074',
  'Sunday': '#FF3357',
}

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Container = styled.View`
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

const CompleteButton = styled(TouchableOpacity)`
    width: 100%;
    background-color: ${(props) => props.theme.colors.white};
    padding: 10px;
    border-radius: 8px;
    align-items: center;
    margin-bottom: 20px;
`;

const CompleteText = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.sm};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
  font-weight: ${(props) => props.theme.text.weight.bold};
`;

const EmojiText = styled.Text``;

const ChatButton = styled(TouchableOpacity)`
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const OptionButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.highlight};
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

  const [isProcessing, setIsProcessing] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [proposedChanges, setProposedChanges] = useState([]);
  const [prevProposedChanges, setPrevProposedChanges] = useState([]);

  const user = useSelector((state) => state.user.user);
  const training_plans = useSelector((state) => state.user.training_plans);
  const training_plan = training_plans.filter((p) => p.status === 'ACTIVE')[0];

  const { _day, recoveryGuidance, week } = route.params;
  const { day, date, activities } = _day;

  const [complete, setComplete] = useState(activities.every(activity => activity.status === 'COMPLETE'));

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
    await call('POST', 'users/completeDay', { planId: training_plan_id, date: _day.date })
    posthog.capture('completed_day', { day: day, date: _day.date });
    navigation.goBack();
  };

  const handleChat = () => {
    if (user.subscription_status === 'SUBSCRIBED') {
      navigation.navigate('Chat', { day, week });
      posthog.capture('activity_chat_button_pressed', { day: day, week: week });
    } else {
      dispatch(updateState({
        showSubscribeModal: true,
        subscribeModalTriggeredFrom: 'Chat'
      }))
    }
  }

  const handleChangeActivity = () => {
    if (user.subscription_status !== 'SUBSCRIBED') {
      dispatch(updateState({
        showSubscribeModal: true,
        subscribeModalTriggeredFrom: 'View day activity quick change'
      }));
    } else {
      posthog.capture('activity_change_button_pressed', { day: day, week: week });
      setProposedChanges([]);
      setIsChanging(true);
    }
  };

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
        <Title style={{ marginBottom: 0, marginLeft: 10, flex: 1 }}>{moment(date).format('dddd, MMMM Do')}</Title>
        <ChatButton onPress={handleChat}><ChatIcon /></ChatButton>
      </View>
      {activities.map((activity, i) => {
        return (
          <ActivityContainer key={activity.id}>
            <ActivityHeader color={DAY_COLOR_MAP[day]}>
              <HeaderText>Session</HeaderText>
            </ActivityHeader>
            <ActivityBody>
              <Left>
                <NumberText>{i + 1}</NumberText>
              </Left>
              <View style={{ marginLeft: 6, marginRight: 12, width: 2, backgroundColor: '#f8f8f810', height: '100%', borderRadius: 50 }} />
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
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
        {recoveryGuidance && <BodyText style={{ fontWeight: 600, marginBottom: 10 }}>Recovery guidance</BodyText>}
        {recoveryGuidance && <BodyText>{recoveryGuidance}</BodyText>}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <OptionButton onPress={handleChat}>
            <Help />
            <OptionText>Ask a question</OptionText>
          </OptionButton>
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
      </ScrollView>
      {!complete && <CompleteButton onPress={handleComplete}>
        <CompleteText>Complete day</CompleteText>
      </CompleteButton>}
    </Container>
  );
};

export default ViewDay;

// TODO NEXT: HOOK PROFILE CHANGES INTO PLAN