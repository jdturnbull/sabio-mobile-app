import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions, useColorScheme } from 'react-native';
import styled, { useTheme } from 'styled-components';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

const Title = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  font-size: 13px;
  color: ${(props) => props.theme.text.colors.secondary};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.semibold};
`;

const Body = styled.Text`
  font-family: ${(props) => props.theme.text.family};
  font-size: 13px;
  color: ${(props) => props.theme.text.colors.highlight};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  font-weight: ${(props) => props.theme.text.weight.regular};
  margin-top: 5px;
`;

const StyledPressable = styled.Pressable`
  margin-top: 20px;
  background-color: ${(props) => props.theme.text.colors.primary};
  border-radius: 10px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = ({ data, setModalData }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
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
        <View
          style={[
            styles.container,
            { backgroundColor: theme.text.colors.secondaryInverse, shadowOpacity: colorScheme === 'light' ? 0.5 : 0.1 },
          ]}>
          <Title>{data?.item.title.toUpperCase()}</Title>
          {!expanded && (
            <Body numberOfLines={1}>{data?.item.analysis ? data?.item.analysis : data?.item.guidance}</Body>
          )}
          <StyledPressable onPress={handlePress}>
            <Text style={styles.pressableText}>{expanded ? 'Close' : 'Open'}</Text>
          </StyledPressable>
          {expanded && (
            <View style={styles.content}>
              <View>
                <Title style={{ marginBottom: 20 }}>{data?.item.analysis ? 'ANALYSIS' : 'GUIDANCE'}</Title>
                <Body>{data?.item.guidance}</Body>
              </View>
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  container: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    shadowColor: '#988232',
    shadowOffset: {
      width: 0,
      height: -110,
    },

    shadowRadius: 180,
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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
  },
});
