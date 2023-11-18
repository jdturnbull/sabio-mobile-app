import React, { useEffect } from 'react';
import { View } from 'react-native';
import DateSelector from './components/DateSelector';
import CardView from './components/CardView';
import { useDispatch } from 'react-redux';
import { getPlan } from '../../../../stores/user/userSlice';

const Home = () => {
  const dispatch = useDispatch();

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
