import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Dimensions, View, Alert } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import ArrowRight from '../../../../assets/icons/24x/ArrowRight';
import Chat from '../../../../assets/icons/24x/Chat';
import WeekView from '../components/WeekView';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../../../stores/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePostHog } from 'posthog-react-native';

const Container = styled.View`
  flex: 1;
  background-color: #16171b;
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 20px;
  padding: 20px;
`;

const HeaderTouchable = styled(TouchableOpacity)`
  width: 25px;
`;

const HeaderText = styled.Text`
  flex: 1;
  font-family: ${(props) => props.theme.text.family};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.md};
  font-weight: ${(props) => props.theme.text.weight.bold};
  font-size: ${(props) => props.theme.text.size.md};
  color: ${(props) => props.theme.text.colors.white};
  text-align: center;
`;

const Scrollable = styled(ScrollView)`
  flex: 1;
`;

const WeekContainer = styled.View`
  width: ${Dimensions.get('window').width}px;
  padding-horizontal: 20px;
`;

const FloatingButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 28px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const Slider = ({ weeks, handleComplete }) => {
  const posthog = usePostHog();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user?.user);
  const scrollViewRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const [_weeks, _setWeeks] = useState(weeks);

  useEffect(() => {
    _setWeeks(weeks);
  }, [weeks]);

  useEffect(() => {
    if (_weeks) {
      const currentDate = moment();
      const currentWeekIndex = _weeks.findIndex(week =>
        week.activities.some(activity =>
          moment(activity.date).isSame(currentDate, 'week')
        )
      );
      if (currentWeekIndex !== -1) {
        if (currentWeekIndex > 5) {
          setVisibleIndex(currentWeekIndex);
          scrollViewRef.current.scrollTo({ x: currentWeekIndex * Dimensions.get('window').width, animated: false });
        }
      }
    }
  }, []);

  const handlePrev = () => {
    if (visibleIndex > 0) {
      setVisibleIndex((prev) => prev - 1);
      scrollViewRef.current.scrollTo({ x: (visibleIndex - 1) * Dimensions.get('window').width, animated: true });
    }
  };

  const handleNext = () => {
    if (visibleIndex !== weeks.length - 1) {
      setVisibleIndex((prev) => prev + 1);
      scrollViewRef.current.scrollTo({ x: (visibleIndex + 1) * Dimensions.get('window').width, animated: true });
    }
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setVisibleIndex(index);
  };

  const handleChatPress = async () => {
    if (user.subscription_status === 'SUBSCRIBED') {
      posthog.capture('used_premium_feature', { feature: 'main_chat', was_trial: false });
      navigation.navigate('Chat');
    } else {
      const accountMoreThanTwoWeeksOld = moment().isAfter(moment(user?.created_at).add(2, 'weeks'));
      const thisWeekNumber = moment().week().toString();
      const lastFreeChatAt = await AsyncStorage.getItem('lastFreeChatAt') || 0;

      // If the account isn't more than two weeks old, just send them straight to the chat
      if (!accountMoreThanTwoWeeksOld) {
        posthog.capture('used_premium_feature', { feature: 'main_chat', was_trial: true });
        navigation.navigate('Chat');
      } else {
        // So there acount is older than two weeks, but have they used their free chat this week?
        if (thisWeekNumber === lastFreeChatAt) {
          // They have used their free chat this week
          posthog.capture('tried_to_use_premium_feature', { feature: 'main_chat' });
          dispatch(updateState({
            showSubscribeModal: true,
            subscribeModalTriggeredFrom: 'Chat'
          }))
        } else {
          // They have not used their free chat this week
          Alert.alert('You can chat for free once a week', 'To use your free weekly chat, confirm below.', [
            {
              text: 'Cancel', onPress: () => { }
            },
            {
              text: 'Confirm', onPress: async () => {
                posthog.capture('used_premium_feature', { feature: 'main_chat', was_trial: false, was_free: true });
                await AsyncStorage.setItem('lastFreeChatAt', moment().week().toString());
                navigation.navigate('Chat');
              }
            }
          ]);
        }
      }
    }
  };


  return (
    <Container>
      <Header>
        <HeaderTouchable onPress={handlePrev}>
          <ArrowLeft style={visibleIndex === 0 ? { display: 'none' } : {}} />
        </HeaderTouchable>
        <HeaderText allowFontScaling={false}>{`Week ${_weeks[visibleIndex]?.week || ''}`}</HeaderText>
        <HeaderTouchable onPress={handleNext}>
          <ArrowRight style={visibleIndex === _weeks.length - 1 ? { display: 'none' } : {}} />
        </HeaderTouchable>
      </Header>
      <Scrollable
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}>
        {_weeks.map((__week, index) => (
          <WeekContainer key={index}>
            <WeekView week={__week} handleComplete={handleComplete} />
          </WeekContainer>
        ))}
      </Scrollable>
      <FloatingButton onPress={handleChatPress}>
        <Chat color="#FFFFFF" />
      </FloatingButton>
    </Container>
  );
};

export default Slider;
