import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Dimensions, Keyboard } from 'react-native';
import { TouchableWithoutFeedback, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { clamp, snapPoint } from 'react-native-redash';
import { useNavigation } from '@react-navigation/core';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ScreenContext = React.createContext();

const Container = styled.View`
  flex: 1;
`;
const OverlayContainer = styled(Animated.View)`
  width: ${`${screenWidth}px`};
  height: ${`${screenHeight}px`};
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: black;
`;
const Overlay = ({ style, onPress }) => (
  <OverlayContainer style={style}>
    <TouchableWithoutFeedback containerStyle={{ flex: 1 }} onPress={onPress} />
  </OverlayContainer>
);

const Screen = styled(Animated.View)`
  flex: 1;
  background-color: #0f1013;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  shadow-color: black;
  shadow-offset: 2px 0px;
`;

// We need to disable the swipe gesture here if we are mid way down the scroll
export const ScreenProvider = ({ children }) => {
  const { navigate } = useNavigation();

  const screenRef = useRef();
  const [locked, setLocked] = useState(true);
  const [onClose, setOnClose] = useState();

  const keyboardSize = 216;
  const halfScreenSize = 240;
  // const points = [screenHeight * 0.1, screenHeight - keyboardSize - halfScreenSize, screenHeight];
  // const points = [screenHeight * 0.06, screenHeight];

  const CLOSED = screenHeight;
  const OPEN = screenHeight * 0.06;

  const translateY = useSharedValue(CLOSED);

  const navHome = () => {
    onClose && onClose();
    setTimeout(() => navigate('Home'), 250);
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = clamp(ctx.offsetY + event.translationY, OPEN - 20, CLOSED);
    },
    onEnd: (event) => {
      const sPoint = snapPoint(translateY.value, event.velocityY, [OPEN, CLOSED]);
      translateY.value = withSpring(sPoint, { stiffness: 150, damping: 18 });

      if (sPoint === CLOSED) {
        runOnJS(navHome)();
      }
    },
  });

  // this animates the screen opening
  useEffect(() => {
    translateY.value = withTiming(OPEN, { duration: 300 });
  }, []);

  const handleOverlayTouch = () => {
    Keyboard.dismiss();
    translateY.value = withTiming(CLOSED, { duration: 300 });
    navHome();
  };
  const closeScreen = () => {
    Keyboard.dismiss();
    translateY.value = withTiming(CLOSED, { duration: 300 });
    navHome();
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: (screenHeight - translateY.value) / screenHeight,
  }));
  const style = useAnimatedStyle(() => ({
    borderRadius: 20,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ScreenContext.Provider value={{ screenRef, locked, setLocked, closeScreen, setOnClose }}>
      <Container>
        <Overlay style={overlayStyle} onPress={handleOverlayTouch} />
        <PanGestureHandler
          ref={screenRef}
          enabled={!locked}
          activeOffsetY={5}
          failOffsetY={-5}
          onGestureEvent={onGestureEvent}>
          <Screen style={style}>{children}</Screen>
        </PanGestureHandler>
      </Container>
    </ScreenContext.Provider>
  );
};

export default () => useContext(ScreenContext);
