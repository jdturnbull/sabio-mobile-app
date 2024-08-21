import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { TouchableOpacity, View } from "react-native";
import Sabio from '../../../../assets/icons/32x/SabioArmUp';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { usePostHog } from "posthog-react-native";

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
    padding: 8px;
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
    const posthog = usePostHog();
    const [showMessage, setShowMessage] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const height = useSharedValue(50);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    useEffect(() => {
        if (showMessage) {
            height.value = withTiming(contentHeight, { duration: 500 });
        } else {
            height.value = withTiming(50, { duration: 500 });
        }
    }, [showMessage, contentHeight, height]);

    const toggleMessage = () => {
        posthog.capture('sabio_weekly_message_toggle', { opening: showMessage ? false : true });
        setShowMessage(prev => !prev);
    }

    const getMessageText = () => {
        if (disabled) {
            return 'Example weekly guidance';
        }
        let message = focus;
        if (nutrition) {
            message += `\n\n${nutrition.caloric_intake}\n\n${nutrition.macronutrients}`;
        }
        return message;
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
                        {getMessageText()}
                    </MessageText>
                </View>
                <MessageContainer style={animatedStyle}>
                    <MessageText>
                        {getMessageText()}
                    </MessageText>
                </MessageContainer>
                {!disabled && <ToggleButton onPress={toggleMessage}>
                    <ToggleButtonText>{showMessage ? "See less" : "See more"}</ToggleButtonText>
                </ToggleButton>}
            </Right>
        </Container>
    )
}

export default SabioMessage;