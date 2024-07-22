import React from "react";
import styled from "styled-components";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, withSpring, useAnimatedStyle, runOnJS, interpolate, Extrapolate } from 'react-native-reanimated';
import Archive from '../../../../assets/icons/24x/Archive';

const Container = styled(TouchableOpacity)`
    border-radius: 10px;
    padding: 10px;
    background-color: ${(props) => props.theme.colors.background3};
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-vertical: 5px;
    height: 50px;
`;

const LabelText = styled.Text`
    font-size: ${(props) => props.theme.text.size.sm};
    letter-spacing: ${(props) => props.theme.text.letterSpacing.sm};
    font-family: ${(props) => props.theme.text.family};
    color: ${(props) => props.theme.text.colors.white};
    flex: 1;
`;

const EditableOption = ({ label, item, onPress, handleSwipe }) => {

    const handlePress = () => onPress(item.id);

    const translateX = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            if (event.translationX < 0) {
                translateX.value = event.translationX;
            }
        },
        onEnd: (event) => {
            if (event.translationX < -100) {
                runOnJS(handleSwipe)(item.id);
                translateX.value = withSpring(0);
            } else {
                translateX.value = 0;
            }
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <GestureHandlerRootView>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={animatedStyle}>
                    <Container onPress={handlePress}>
                        <LabelText>{label}</LabelText>
                    </Container>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    )
}

export default EditableOption; 