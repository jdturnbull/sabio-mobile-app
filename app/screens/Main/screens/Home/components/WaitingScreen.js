import React, { useEffect, useState } from 'react';
import { Animated, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { getIconFromLabel } from '../../../../../utils/icon';

const WaitingScreen = () => {
  const YogaIcon = getIconFromLabel('yoga');

  const [fadeAnim] = useState(new Animated.Value(1));

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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <YogaIcon />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
          <ActivityIndicator style={{ marginRight: 15 }} />
          <View>
            <Animated.Text style={[styles.pulseText, { opacity: fadeAnim }]}>Sabio is creating your plan</Animated.Text>
            <Animated.Text style={[{ color: '#ffffff70' }, { opacity: fadeAnim }]}>
              This usually takes a few minutes
            </Animated.Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WaitingScreen;

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
