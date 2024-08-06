import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import DayItem from './DayItem';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import PlanScreenOptions from './PlanScreenOptions';
import SabioMessage from './SabioMessage';

const Container = styled(ScrollView)`
  flex: 1;
`;

const getDayAndDate = (activity) => {
  const day = moment(activity.date).format('dddd');
  const date = moment(activity.date).format('YYYY-MM-DD');
  return { day, date };
};

const groupActivitiesByDay = (activities) => {
  const daysMap = new Map();
  activities.forEach(activity => {
    const { day, date } = getDayAndDate(activity);
    if (!daysMap.has(day)) {
      daysMap.set(day, { day, date, activities: [] });
    }
    daysMap.get(day).activities.push(activity);
  });
  return daysMap;
};

const sortDays = (daysMap) => {
  const sortedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return Array.from(daysMap.values()).sort((a, b) => sortedDays.indexOf(a.day) - sortedDays.indexOf(b.day));
};

const WeekView = ({ week }) => {
  const [loading, setLoading] = useState(true);
  const opacity = useSharedValue(0);

  const days = useMemo(() => {
    const daysMap = groupActivitiesByDay(week.activities);
    return sortDays(daysMap);
  }, [week]);

  useEffect(() => {
    if (days.length > 0) {
      setLoading(false);
      opacity.value = withTiming(1, { duration: 1000 });
    }
  }, [days, week]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: opacity.value,
    };
  });


  if (loading) {
    return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color="#f8f8f8" />
    </View>)
  }

  return (
    <Animated.View style={animatedStyle}>
      <Container showsVerticalScrollIndicator={false}>
        <PlanScreenOptions week={week} />
        <SabioMessage focus={week.focus} nutrition={week.nutrition_guidelines} />
        {days.map((day, i) => <DayItem key={day.date} index={i} _day={day} recoveryGuidance={week.recovery_guidelines.monitor} />)}
      </Container>
    </Animated.View>
  );
};

export default WeekView;
