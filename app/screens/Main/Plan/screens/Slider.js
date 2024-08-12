import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Dimensions, View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import ArrowLeft from '../../../../assets/icons/24x/ArrowLeft';
import ArrowRight from '../../../../assets/icons/24x/ArrowRight';
import Chat from '../../../../assets/icons/24x/Chat';
import WeekView from '../components/WeekView';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../../../stores/user/userSlice';

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

const Slider = ({ weeks }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user?.user);
  const scrollViewRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const [_weeks, _setWeeks] = useState(weeks);

  useEffect(() => {
    _setWeeks(weeks);
    const currentDate = moment();
    const currentWeekIndex = weeks.findIndex(week =>
      week.activities.some(activity =>
        moment(activity.date).isSame(currentDate, 'week')
      )
    );
    if (currentWeekIndex !== -1) {
      setVisibleIndex(currentWeekIndex);
      scrollViewRef.current.scrollTo({ x: currentWeekIndex * Dimensions.get('window').width, animated: false });
    }
  }, [weeks]);

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

  const handleChatPress = () => {
    if (user.subscription_status === 'SUBSCRIBED') {
      navigation.navigate('Chat');
    } else {
      dispatch(updateState({
        showSubscribeModal: true,
        subscribeModalTriggeredFrom: 'Chat'
      }))
    }
  };


  return (
    <Container>
      <Header>
        <HeaderTouchable onPress={handlePrev}>
          <ArrowLeft style={visibleIndex === 0 ? { display: 'none' } : {}} />
        </HeaderTouchable>
        <HeaderText>{`Week ${_weeks[visibleIndex]?.week || ''}`}</HeaderText>
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
            <WeekView week={__week} />
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
