import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import DateSelector from './components/DateSelector';
import { useDispatch, useSelector } from 'react-redux';
import { getPlan } from '../../../../stores/user/userSlice';
import Content from './components/Content';

const Home = () => {
  const dispatch = useDispatch();
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPlans = () => {
      dispatch(getPlan());
    };

    fetchPlans();

    if (plannedActivities.length === 0) {
      intervalRef.current = setInterval(() => {
        fetchPlans();
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (plannedActivities.length > 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [plannedActivities.length]);

  return (
    <View style={{ flex: 1 }}>
      <DateSelector />
      <Content />
    </View>
  );
};

export default Home;
