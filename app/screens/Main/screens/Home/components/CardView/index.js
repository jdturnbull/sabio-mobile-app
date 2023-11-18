import React, { useEffect } from 'react';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import Card from './components/Card';
import { StyleSheet } from 'react-native';
import useUIState from '../../../../../../hooks/useUIState';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 15,
  },
});

const CardView = () => {
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  // Activities by selected Date
  const [activities, setActivities] = React.useState([]);

  const { selectedDate } = useUIState();

  useEffect(() => {
    const filteredActivities = plannedActivities.filter((activity) => {
      return activity.date === selectedDate;
    });
    setActivities(filteredActivities);
  }, [selectedDate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activities.map((activity) => (
          <Card key={activity.id} activity={activity} />
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default CardView;
