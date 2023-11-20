import React, { useEffect } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import DateSelector from './components/DateSelector';
import CardView from './components/CardView';
import { useDispatch, useSelector } from 'react-redux';
import { getPlan } from '../../../../stores/user/userSlice';
import useUIState from '../../../../hooks/useUIState';
import { Text } from 'react-native-svg';

const Home = () => {
  const dispatch = useDispatch();
  const { selectedDate } = useUIState();

  useEffect(() => {
    dispatch(getPlan());
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DateSelector />
      <CardView />
    </View>
  );
};

export default Home;
