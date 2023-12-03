import React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const { height: screenHeight } = Dimensions.get('window');

const ModalContent = ({ setShowPlan }) => {
  const user = useSelector((state) => state.user.session.user);

  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = Math.max(context.startY + event.translationY, 0);
    },
    onEnd: () => {
      if (translateY.value > 100) {
        translateY.value = withTiming(screenHeight, { duration: 300 }, () => {
          runOnJS(setShowPlan)(false);
        });
      } else {
        translateY.value = withTiming(0, { duration: 300 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <View style={styles.container}>
          <View style={styles.topSwipeDown}>
            <View style={{ width: 30, height: 3, backgroundColor: '#8AA1B140' }} />
          </View>
          <Text style={styles.title}>Journey Plan</Text>
          <ScrollView>
            <Text style={styles.body}>{user.plan}</Text>
          </ScrollView>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default ModalContent;

const styles = StyleSheet.create({
  overlay: {
    height: screenHeight,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    height: screenHeight * 0.75,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#8AA1B140',
    backgroundColor: '#16171B',
  },
  topSwipeDown: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Noto Sans',
    fontWeight: '700',
    color: '#8AA1B190',
    fontSize: 16,
    marginBottom: 20,
  },
  body: {
    fontFamily: 'Noto Sans',
    fontWeight: '400',
    color: '#8AA1B190',
    fontSize: 14,
    marginTop: 5,
  },
  pressable: {
    marginTop: 20,
    backgroundColor: '#8AA1B1',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableText: {
    fontFamily: 'Noto Sans',
    fontWeight: '700',
    color: '#f8f8f8',
    fontSize: 16,
  },
});
