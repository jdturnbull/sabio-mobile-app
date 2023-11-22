import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, View, Animated, Text } from 'react-native';
import { useSelector } from 'react-redux';
import useUIState from '../../../../../../hooks/useUIState';
import { getIconFromLabel } from '../../../../../../utils/icon';
import Card from './components/Card';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 15,
  },
  pulseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

const Content = () => {
  const user = useSelector((state) => state.user.session?.user);
  const plannedActivities = useSelector((state) => state.user.plannedActivities);
  const [activities, setActivities] = useState([]);
  const { selectedDate } = useUIState();
  const [fadeAnim] = useState(new Animated.Value(1));

  const Logo = getIconFromLabel('logoLarge');

  const textString =
    selectedDate < moment.utc(user?.createdAt).format('YYYY-MM-DD')
      ? 'You had not hired Sabio yet!'
      : selectedDate === moment.utc(user?.createdAt).format('YYYY-MM-DD')
      ? 'Sabio created your plan! View the rest of the week via the date selector above.'
      : "Sabio hasn't planned this day yet";

  useEffect(() => {
    const filteredActivities = plannedActivities.filter((activity) => {
      return activity.date === selectedDate;
    });
    setActivities(filteredActivities);
  }, [selectedDate, plannedActivities]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  const YogaIcon = getIconFromLabel('yoga');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {plannedActivities.length > 0 && activities.length > 0 ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {activities.map((activity) => (
            <Card key={activity.id} activity={activity} />
          ))}
        </ScrollView>
      ) : plannedActivities.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <YogaIcon />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
            <ActivityIndicator style={{ marginRight: 15 }} />
            <Animated.Text style={[styles.pulseText, { opacity: fadeAnim }]}>Sabio is creating your plan</Animated.Text>
          </View>
        </View>
      ) : plannedActivities.length > 0 && activities.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Logo />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 16,
              color: '#ffffff60',
              marginTop: 40,
              marginBottom: 40,
              paddingHorizontal: 40,
              textAlign: 'center',
              lineHeight: 24,
            }}>
            {textString}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
    </GestureHandlerRootView>
  );
};

export default Content;
