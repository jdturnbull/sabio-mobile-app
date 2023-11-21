import React, { useEffect } from 'react';
import { View } from 'react-native';
import DateSelector from './components/DateSelector';
import { useDispatch } from 'react-redux';
import { getPlan } from '../../../../stores/user/userSlice';
import useUIState from '../../../../hooks/useUIState';
import Content from './components/Content';

const Home = () => {
  const dispatch = useDispatch();
  const { selectedDate } = useUIState();

  useEffect(() => {
    dispatch(getPlan());
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DateSelector />
      <Content />
    </View>
  );
};

export default Home;
