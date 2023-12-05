import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

const Footer = ({ data, setModalData }) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [renderFooter, setRenderFooter] = useState(data !== null);
  const [expanded, setExpanded] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const heightAnim = useSharedValue(155);
  const gestureY = useSharedValue(0);

  useEffect(() => {
    if (data) {
      setRenderFooter(true);
      heightAnim.value = withTiming(155, { duration: 200 });
    } else {
      heightAnim.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setRenderFooter)(false);
        runOnJS(setExpanded)(false);
      });
    }

    if (isFirstRender) {
      setTimeout(() => setIsFirstRender(false), 500);
    }
  }, [data, heightAnim, isFirstRender]);

  // If data is null, reset everything
  useEffect(() => {
    if (!data) {
      setExpanded(false);
      setRenderFooter(false);
    }
  }, [data]);

  const handlePress = () => {
    if (expanded) {
      heightAnim.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setRenderFooter)(false);
        runOnJS(setExpanded)(false);

        // Reset the modal data
        runOnJS(setModalData)(null);
      });
    } else {
      heightAnim.value = withTiming(screenHeight / 2, { duration: 300 }, () => {
        runOnJS(setExpanded)(true);
      });
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = gestureY.value;
    },
    onActive: (event, context) => {
      gestureY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      if (gestureY.value > 100) {
        // Threshold for closing the view
        heightAnim.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(setRenderFooter)(false);
          runOnJS(setExpanded)(false);
        });
      } else {
        // Snap back to the expanded position
        heightAnim.value = withTiming(screenHeight / 2, { duration: 300 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
    };
  });

  if (!renderFooter) {
    return null;
  }

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <View style={styles.container}>
          <Text style={styles.title}>{data?.item.title}</Text>
          <Text numberOfLines={1} style={styles.body}>
            {data?.item.analysis ? data?.item.analysis : data?.item.guidance}
          </Text>
          <Pressable style={styles.pressable} onPress={handlePress}>
            <Text style={styles.pressableText}>{expanded ? 'Close' : 'Open'}</Text>
          </Pressable>
          {expanded && (
            <View style={styles.content}>
              <View>
                <Text style={styles.title}>{data?.item.analysis ? 'Analysis' : 'Guidance'}</Text>
                <Text style={styles.body}>{data?.item.analysis ? data?.item.analysis : data?.item.guidance}</Text>
              </View>
              {!data?.item.analysis && (
                <View>
                  <Text style={styles.title}>Reasoning</Text>
                  <Text style={styles.body}>{data?.item.reasoning}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Footer;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    backgroundColor: '#16171B',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  container: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#8AA1B130',
    padding: 20,
  },
  title: {
    fontFamily: 'Noto Sans',
    fontWeight: '700',
    color: '#8AA1B190',
    fontSize: 16,
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
  content: {
    marginTop: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
});
