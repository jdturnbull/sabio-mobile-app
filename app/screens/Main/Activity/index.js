import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, Animated, Text, Pressable } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getIconFromLabel } from '../../../utils/icon';
import { updateState } from '../../../stores/chat/chatSlice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8D1F00',
  },
  topContainer: {
    height: '25%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 72,
    minHeight: 213,
  },
  modal: {
    height: '75%',
    backgroundColor: '#0f1013',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    zIndex: 1,
    padding: 20,
  },
  bottomColouredContainer: {
    backgroundColor: '#0f1013',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    zIndex: 0,
  },
  modalTop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#ffffff40',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    marginTop: 40,
  },
  modalHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  contentHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C4C4C4',
    marginLeft: 20,
  },
  contentBody: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 20,
    color: '#737476',
    fontWeight: '600',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 30,
  },
  pressable: {
    backgroundColor: '#1F2025',
    padding: 20,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowColor: '#000',
  },
  pressableText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});

const Activity = () => {
  const dispatch = useDispatch();
  const threshold = 100;
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;

  const { activity } = navigation.getState().routes[0].params;

  const RunnerIcon = getIconFromLabel('runner');
  const BoltIcon = getIconFromLabel('bolt');

  const handleGestureEvent = useCallback(
    Animated.event(
      [
        {
          nativeEvent: {
            translationY: translateY,
          },
        },
      ],
      { useNativeDriver: true },
    ),
    [],
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let { translationY } = event.nativeEvent;

      if (translationY > threshold) {
        navigation.goBack();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          speed: 14,
          bounciness: 12,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handlePress = () => {
    dispatch(updateState({ activity }));
    navigation.navigate('TabStack', { screen: 'chat' });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F18F64', '#8D1F00']} style={styles.topContainer}>
        <RunnerIcon />
      </LinearGradient>
      <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={{ ...styles.modal, transform: [{ translateY }] }}>
          <View style={styles.modalTop}>
            <View style={styles.line} />
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>{activity.title}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'space-evenly', marginTop: 20 }}>
              <View style={styles.contentContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                  <BoltIcon />
                  <Text style={styles.contentHeader}>Guidance</Text>
                </View>
                <Text style={styles.contentBody}>{activity.guidance}</Text>
              </View>
              <View style={styles.contentContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                  <BoltIcon />
                  <Text style={styles.contentHeader}>Reasoning</Text>
                </View>
                <Text style={styles.contentBody}>{activity.reasoning}</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable onPress={handlePress} style={styles.pressable}>
              <Text style={styles.pressableText}>Ask Sabio</Text>
            </Pressable>
          </View>
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.bottomColouredContainer} />
    </View>
  );
};

export default Activity;
