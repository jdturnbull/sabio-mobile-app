import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import * as RNIap from 'react-native-iap';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions, Platform, Linking, Alert } from 'react-native';
import {
  initConnection,
  requestSubscription,
  purchaseErrorListener,
  purchaseUpdatedListener,
  useIAP,
} from 'react-native-iap';
import call from '../../utils/call';
import { getIconFromLabel } from '../../utils/icon';
import { useDispatch, useSelector } from 'react-redux';
import { setup, updateState } from '../../stores/user/userSlice';
import { useNavigation } from '@react-navigation/native';
import { useMixpanel } from '../../hooks/useMixpanel';

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
  margin-top: 30px;
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

const TickItem = ({ label, Icon }) => {
  return (
    <TickItemContainer>
      <Icon />
      <TickLabel>{label}</TickLabel>
    </TickItemContainer>
  );
};

const Payment = () => {
  const navigation = useNavigation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const session = useSelector((state) => state.user.session);
  const user = useSelector((state) => state.user.session?.user);
  const { getSubscriptions, connected } = useIAP();

  const { track, identify } = useMixpanel();

  useEffect(() => {
    if (user) {
      identify({ userId: user.id, email: user.email, name: user.name });
      track('SCREEN_VIEW', { screen: 'Payment' });
    }
  }, [user]);

  const Logo = getIconFromLabel('logoLarge');
  const Tick = getIconFromLabel('tick');

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
      track('ERROR', { screen: 'Payment', error: error });
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    setLoading(true);

    track('USER_ACTION', { action: 'Pressed restore subscription', screen: 'Payment' });

    const availablePurchases = await RNIap.getAvailablePurchases();
    const sortedAvailablePurchases = availablePurchases.sort((a, b) => b.transactionDate - a.transactionDate);
    const latestAvailableReceipt = sortedAvailablePurchases[0].transactionReceipt;

    const valid = await call('POST', 'users/restorePurchase', { receipt: latestAvailableReceipt, userId: user.id });

    if (valid) {
      track('USER_ACTION', { action: 'Restored subscription', screen: 'Payment' });

      // Get the user, and update the user state
      const updated_user = await call('GET', `users/${user.id}`);
      dispatch(updateState({ session: { ...session, user: updated_user } }));

      setLoading(false);
      navigation.navigate('Authed');
    } else {
      setLoading(false);
      Alert.alert('No subscription found, if you are having issues please contact support@heysabio.com');
    }
  };

  useEffect(() => {
    purchaseUpdatedListener(async (purchase) => {
      purchase.transactionReceipt;
      if (purchase.transactionReceipt) {
        const response = await call('POST', 'users/confirmSubscription', { userId: user.id, purchase });

        if (response) {
          track('USER_ACTION', { action: 'Confirmed subscription', screen: 'Payment' });
          // Get the user, and update the user state
          const updated_user = await call('GET', `users/${user.id}`);
          dispatch(updateState({ session: { ...session, user: updated_user } }));

          setLoading(false);

          navigation.navigate('Authed');
        } else {
          track('ERROR', {
            screen: 'Payment',
            error: 'There was a problem with your purchase, you can contact support at support@heysabio.com',
          });
          setLoading(false);
          Alert.alert('There was a problem with your purchase, you can contact support at support@heysabio.com');
        }
      }
    });

    purchaseErrorListener((error) => {
      track('ERROR', { screen: 'Payment', error: error.message });
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
        One week <Headline style={{ color: theme.text.colors.primary }}>free trial</Headline> then £9.99 / month
      </Headline>
      <View
        style={
          Platform.isPad
            ? { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }
            : { width: '100%' }
        }>
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
      <View style={{ marginTop: 15 }}>
        <Pressable style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }} onPress={restorePurchases}>
          <Text style={{ color: theme.text.colors.primary }}>Restore subscription</Text>
        </Pressable>
        <Text style={{ color: theme.text.colors.secondary }}>
          Subscription automatically renews at £9.99 / month. By subscribing you agree to the{' '}
          <Text
            onPress={() => Linking.openURL('https://heysabio.com/terms')}
            style={{ textDecorationLine: 'underline', color: theme.text.colors.secondary }}>
            terms
          </Text>{' '}
          and{' '}
          <Text
            onPress={() => Linking.openURL('https://heysabio.com/privacy-policy')}
            style={{ textDecorationLine: 'underline', color: theme.text.colors.secondary }}>
            privacy policy
          </Text>
          .
        </Text>
      </View>
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
    </Container>
  );
};

export default Payment;
