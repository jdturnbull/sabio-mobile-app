import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import {
  initConnection,
  requestSubscription,
  purchaseErrorListener,
  purchaseUpdatedListener,
  useIAP,
} from 'react-native-iap';
import call from '../../../utils/call';
import { getIconFromLabel } from '../../../utils/icon';
import { useDispatch, useSelector } from 'react-redux';
import { setup } from '../../../stores/user/userSlice';

const Container = styled.View`
  flex: 1;
  align-items: center;
  padding-top: ${(props) => props.theme.spacing.safeAreaView};
  width: 100%;
  height: 100%;
  padding-horizontal: 10%;
  background-color: ${(props) => props.theme.colors.background1};
`;

const Headline = styled.Text`
  margin-top: 10%;
  margin-bottom: 13%;
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.xl};
  color: ${(props) => props.theme.text.colors.secondary};
  font-weight: ${(props) => props.theme.text.weight.bold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const BodyText = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  line-height: 24px;
  margin-bottom: 20px;
`;

const GetStartedButton = styled.Pressable`
  background-color: ${(props) => props.theme.colors.primary};
  margin-top: 65px;
  border-radius: 18px;
  padding: 24px;
  align-items: center;
  justify-content: center;
`;

const GetStartedText = styled.Text`
  color: ${(props) => props.theme.text.colors.secondaryInverse};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.md};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const TickItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const TickLabel = styled.Text`
  color: ${(props) => props.theme.text.colors.secondary};
  font-family: ${(props) => props.theme.text.family};
  font-size: 18px;
  font-weight: ${(props) => props.theme.text.weight.regular};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
  margin-left: 10px;
`;

const ModalButton = styled.Pressable`
  background-color: ${(props) => props.theme.colors.background1};
  margin-top: 20px;
  height: 50px;
  width: 100px;
  margin-right: 10px;
  border-radius: 18px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.primary};
`;

const ModalText = styled.Text`
  color: ${(props) => props.theme.text.colors.primary};
  font-family: ${(props) => props.theme.text.family};
  font-size: ${(props) => props.theme.text.size.sm};
  font-weight: ${(props) => props.theme.text.weight.semibold};
  letter-spacing: ${(props) => props.theme.text.letterSpacing.xs};
`;

const TickItem = ({ label, Icon }) => {
  return (
    <TickItemContainer>
      <Icon />
      <TickLabel>{label}</TickLabel>
    </TickItemContainer>
  );
};

const Payment = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.session?.user);
  const { getSubscriptions, connected } = useIAP();

  const Logo = getIconFromLabel('logoLarge');
  const Tick = getIconFromLabel('tick');

  const handleVIP = () => {
    setShowCode(true);
  };

  const handleCodeConfirm = async () => {
    setLoading(true);
    const response = await call('POST', 'users/confirmCode', { userId: user.id, code: code.toLowerCase() });

    if (response) {
      dispatch(setup());
      setLoading(false);
      setShowCode(false);
    } else {
      setLoading(false);
      alert('There was a problem with your code, please try again.');
    }
  };

  const subscribe = async () => {
    try {
      setLoading(true);
      await initConnection();

      if (connected) {
        await getSubscriptions({ skus: ['com.heysabio.sabio.product.base'] });
      }

      await requestSubscription({
        sku: 'com.heysabio.sabio.product.base',
        appAccountToken: user.id,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    purchaseUpdatedListener(async (purchase) => {
      purchase.transactionReceipt;
      if (purchase.transactionReceipt) {
        const response = await call('POST', 'users/confirmSubscription', { userId: user.id, purchase });

        if (response) {
          dispatch(setup());
          setLoading(false);
        } else {
          setLoading(false);
          alert('There was a problem with your purchase, you can contact support at support@heysabio.com');
        }
      }
    });

    purchaseErrorListener((error) => {
      console.log('Purchase Error', error);
      setLoading(false);
    });

    return () => {
      purchaseUpdatedListener();
      purchaseErrorListener();
    };
  }, []);

  return (
    <Container>
      <Logo />
      <Headline>
        Hire Sabio & get started <Headline style={{ color: theme.text.colors.primary }}>for free!</Headline>
      </Headline>
      <View style={{ width: '100%' }}>
        <TickItem Icon={Tick} label={'Try for free'} />
        <TickItem Icon={Tick} label={'Personalised training plan'} />
        <TickItem Icon={Tick} label={'Data driven AI coach'} />
        <TickItem Icon={Tick} label={'Complete plan transparency'} />
        <TickItem Icon={Tick} label={'Replanning functionality'} />
        <TickItem Icon={Tick} label={'Cancel any time'} />
      </View>
      <GetStartedButton onPress={subscribe}>
        <GetStartedText>Start your free trial</GetStartedText>
      </GetStartedButton>
      <Pressable onPress={handleVIP}>
        <Text style={{ marginTop: 20, color: theme.text.colors.secondary, fontFamily: theme.text.family }}>
          Have a code? <Text style={{ color: theme.text.colors.primary }}>Redeem here</Text>
        </Text>
      </Pressable>
      {loading && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            width: screenWidth,
            height: screenHeight,
            backgroundColor: '#000',
            opacity: 0.7,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      )}
      <Modal visible={showCode} animationType="slide" transparent={true}>
        <Container>
          <Headline>Enter your code</Headline>
          <BodyText>Enter your code here for exclusive access.</BodyText>
          <TextInput
            placeholder="Enter your code"
            value={code}
            onChangeText={(text) => setCode(text)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              width: '100%',
              color: theme.colors.secondary,
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <ModalButton style={{ borderColor: theme.colors.secondary }} onPress={() => setShowCode(false)}>
              <ModalText style={{ color: theme.colors.secondary }}>Cancel</ModalText>
            </ModalButton>
            <ModalButton onPress={handleCodeConfirm}>
              <ModalText>Confirm</ModalText>
            </ModalButton>
          </View>
        </Container>
      </Modal>
    </Container>
  );
};

export default Payment;
