import React, { useState } from 'react';
import styled from 'styled-components/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring, runOnJS, withTiming } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { hapticImpactHeavy } from '../../utils/haptics';
import ArrowRight from '../../assets/icons/18x/ArrowRight';
import Tick from '../../assets/icons/24x/Tick';

const { width: screenWidth } = Dimensions.get('window');

const Container = styled(Animated.View)`
  width: ${screenWidth - 40}px;
  margin-bottom: 20px;
  margin-top: 20px;
  height: 50px;
  padding: 5px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background2};
  border-radius: 30px;
  overflow: hidden;
  position: relative;
`;

const Swipeable = styled(Animated.View)`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.highlight};
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 5px;
  z-index: 1;
`;

const BackgroundColorView = styled(Animated.View)`
  height: 50px;
  position: absolute;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.colors.highlight};
  z-index: -1;
`;

const InnerText = styled.Text`
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    text-align: center;
`;

const SwipeToAction = ({ action }) => {
    const [swiped, setSwiped] = useState(false);
    const translateX = useSharedValue(0);
    const backgroundColorWidth = useSharedValue(0);



    const performAction = () => {
        setTimeout(() => {
            action();
        }, 800);
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const backgroundColorStyle = useAnimatedStyle(() => {
        return {
            width: backgroundColorWidth.value,
        };
    });

    const onGestureEvent = useAnimatedGestureHandler({
        onActive: (event) => {
            translateX.value = event.translationX;
            backgroundColorWidth.value = translateX.value;
        },
        onEnd: () => {
            if (translateX.value > 150) {
                runOnJS(setSwiped)(true);
                runOnJS(hapticImpactHeavy)();
                translateX.value = withSpring(screenWidth - 90);
                backgroundColorWidth.value = screenWidth;
                runOnJS(performAction)();
            } else {
                translateX.value = withSpring(0);
                backgroundColorWidth.value = 0;
            }
        },
    });

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Container>
                <Swipeable style={animatedStyle}>
                    {swiped ? <Tick /> : <ArrowRight />}
                </Swipeable>
                <InnerText>
                    {swiped ? 'Completed!' : 'Slide to complete'}
                </InnerText>
                <BackgroundColorView style={backgroundColorStyle} />
            </Container>
        </PanGestureHandler>
    );
};

export default SwipeToAction;