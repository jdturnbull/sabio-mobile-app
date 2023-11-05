import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { getIconFromLabel } from '../utils/icon';
import { useDispatch } from 'react-redux';
import { continueWithApple } from '../stores/user/userSlice';

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

  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Icon />
        <Text style={{ color: '#fff', fontWeight: 500, marginTop: 10, fontSize: 20 }}>
          Welcome to <Text style={{ color: '#E66642', fontWeight: 700 }}>Sabio</Text>
        </Text>
      </View>
      <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            width: 300,
            height: 50,
          }}
          onPress={() => onAppleButtonPress()}
        />
      </View>
    </Container>
  );
};

export default Login;
