import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Pressable, Alert } from 'react-native';
import styled from 'styled-components';
import { request, PERMISSIONS } from 'react-native-permissions';
import { getIconFromLabel } from '../utils/icon';
import { useDispatch } from 'react-redux';
import { continueWithApple } from '../stores/user/userSlice';
import { speak } from '../utils/speak';

const Container = styled.View`
  flex: 1;
  background-color: #0f1013;
  align-items: center;
  justify-content: center;
`;

const Icon = getIconFromLabel('LogoLarge');

const Login = () => {
  const dispatch = useDispatch();

  const onAppleButtonPress = async () => {
    dispatch(continueWithApple());
  };

  const startConversation = async () => {
    const response = await request(PERMISSIONS.IOS.MICROPHONE);
    if (response === 'granted') {
      speak('Hello, how can I help you?');
    } else {
      Alert.alert('Permission Denied', 'Please allow microphone access to continue');
    }
  };

  const translateY = useRef(new Animated.Value(0)).current; // Start off-screen
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0

  useEffect(() => {
    // Start the logo animation when the component mounts
    Animated.timing(translateY, {
      toValue: -100, // Adjust this value to the final position
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // After the logo animation is finished, start the text fade-in
      Animated.timing(fadeAnim, {
        toValue: 1, // Final opacity is 1
        duration: 1200,
        useNativeDriver: true,
      }).start();
    });
  }, [translateY, fadeAnim]);

  return (
    <Container>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ translateY }],
        }}>
        <Icon />
        <Text style={{ color: '#fff', fontWeight: '500', marginTop: 10, fontSize: 25, marginBottom: 50 }}>
          Welcome to <Text style={{ color: '#E66642', fontWeight: '700' }}>Sabio</Text>
        </Text>
        <Animated.Text
          style={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 18,
            opacity: fadeAnim,
          }}>
          Tap to start a conversation with Sabio
        </Animated.Text>
        <Pressable
          onPress={startConversation}
          style={{ width: 200, height: 50, backgroundColor: 'grey', borderRadius: 8, marginTop: '40%' }}
        />
      </Animated.View>
    </Container>
  );
};

export default Login;
