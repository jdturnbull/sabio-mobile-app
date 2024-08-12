import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { TouchableOpacity, View } from "react-native";
import Sabio from '../../../../assets/icons/32x/SabioArmUp';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

const Container = styled.View`
    flex-direction: row;
    shadow-color: #000;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;
`;

const Left = styled.View`
`;

const SabioContainer = styled.View`
    height: 40px;
    width: 40px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
`;

const Right = styled.View`
    flex: 1;
    margin-left: 10px;
`;

const MessageContainer = styled(Animated.View)`
    background-color: ${(props) => props.theme.colors.background2};
    border-radius: 10px;
    overflow: hidden; 
    padding: 10px;
`;

const MessageText = styled.Text`
    font-size: ${(props) => props.theme.text.size.sm};
    font-weight: ${(props) => props.theme.text.weight.semibold};
    color: ${(props) => props.theme.colors.white};
`;

const ToggleButton = styled(TouchableOpacity)`
    margin-top: 10px;
    align-self: flex-start;
`;

const ToggleButtonText = styled.Text`
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.text.size.sm};
    font-weight: ${(props) => props.theme.text.weight.bold};
`;

const SabioMessage = ({ focus, nutrition, disabled }) => {
    const { caloric_intake, macronutrients } = nutrition;
    const [showMessage, setShowMessage] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const height = useSharedValue(35);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    useEffect(() => {
        if (showMessage) {
            height.value = withTiming(contentHeight, { duration: 500 });
        } else {
            height.value = withTiming(35, { duration: 500 });
        }
    }, [showMessage, contentHeight, height]);

    const toggleMessage = () => {
        setShowMessage(prev => !prev);
    };

    return (
        <Container>
            <Left>
                <SabioContainer>
                    <Sabio />
                </SabioContainer>
            </Left>
            <Right>
                <View
                    style={{ position: 'absolute', opacity: 0, padding: 10 }}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setContentHeight(height);
                    }}
                >
                    <MessageText>
                        {disabled ? 'Example weekly guidance' : `${focus}\n\n${caloric_intake}\n\n${macronutrients}`}
                    </MessageText>
                </View>
                <MessageContainer style={animatedStyle}>
                    <MessageText>
                        {disabled ? 'Example weekly guidance' : `${focus}\n\n${caloric_intake}\n\n${macronutrients}`}
                    </MessageText>
                </MessageContainer>
                {!disabled && <ToggleButton onPress={toggleMessage}>
                    <ToggleButtonText>{showMessage ? "Hide" : "Show"} Sabio's advice</ToggleButtonText>
                </ToggleButton>}
            </Right>
        </Container>
    )
}

export default SabioMessage;