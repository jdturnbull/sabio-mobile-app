import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPlan } from '../../../../stores/user/userSlice';
import WaitingScreen from './components/WaitingScreen';
import Header from './components/Header';
import Journey from './components/Journey';

const Home = () => {
  const dispatch = useDispatch();
  const plannedActivities = useSelector((state) => state.user.plannedActivities);

  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPlans = () => {
      dispatch(getPlan());
    };

    fetchPlans();

    if (plannedActivities?.length === 0) {
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
    if (plannedActivities?.length > 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [plannedActivities?.length]);

  if (!plannedActivities || plannedActivities?.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <WaitingScreen />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <Journey />
      </View>
    );
  }
};

export default Home;
