import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import * as RNIap from 'react-native-iap';
import axios from 'axios';
import { REACT_APP_SHARED_SECRET, REACT_APP_POSTHOG_API_KEY } from '@env';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  Platform,
  Linking,
} from 'react-native';
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
import { setup } from '../../stores/user/userSlice';
import { useNavigation } from '@react-navigation/native';

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
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.session?.user);
  const { getSubscriptions, connected } = useIAP();

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
      console.log(error);
      setLoading(false);
    }
  };

  const sendToPosthog = async (type, message, userId) => {
    const data = {
      event: 'purchase_restore_data',
      properties: {
        type,
        message,
      },
      api_key: REACT_APP_POSTHOG_API_KEY,
      distinct_id: userId,
    };

    try {
      await axios.post('https://eu.posthog.com/capture/', data);
      console.log('Error reported to PostHog');
    } catch (posthogError) {
      console.error('Failed to report error to PostHog:', posthogError);
    }
  };

  async function isSubscriptionActive() {
    const availablePurchases = await RNIap.getAvailablePurchases();

    await sendToPosthog('available_purchases', JSON.stringify(availablePurchases), user.id);
    const sortedAvailablePurchases = availablePurchases.sort((a, b) => b.transactionDate - a.transactionDate);
    await sendToPosthog('sorted_available_purchases', JSON.stringify(sortedAvailablePurchases), user.id);
    const latestAvailableReceipt = sortedAvailablePurchases[0].transactionReceipt;
    await sendToPosthog('latest_available_receipt', JSON.stringify(latestAvailableReceipt), user.id);

    const isTestEnvironment = __DEV__;

    await sendToPosthog('is_test_environment', JSON.stringify(isTestEnvironment), user.id);

    const decodedReceipt = await RNIap.validateReceiptIos(
      {
        'receipt-data': latestAvailableReceipt,
        password: REACT_APP_SHARED_SECRET,
      },
      isTestEnvironment,
    );

    await sendToPosthog('decoded_receipt', JSON.stringify(decodedReceipt), user.id);

    const { latest_receipt_info: latestReceiptInfo } = decodedReceipt;

    await sendToPosthog('latest_receipt_info', JSON.stringify(latestReceiptInfo), user.id);

    const isSubValid = !!latestReceiptInfo.find((receipt) => {
      const expirationInMilliseconds = Number(receipt.expires_date_ms);
      const nowInMilliseconds = Date.now();
      return expirationInMilliseconds > nowInMilliseconds;
    });

    await sendToPosthog('is_sub_valid', JSON.stringify(isSubValid), user.id);

    return { valid: isSubValid, receipt: latestAvailableReceipt };
  }

  const restorePurchases = async () => {
    const { valid, receipt } = await isSubscriptionActive();

    if (valid) {
      const response = await call('POST', 'users/confirmSubscription', { userId: user.id, receipt });

      if (response) {
        dispatch(setup());
        setLoading(false);
        navigation.navigate('Chat');
      } else {
        setLoading(false);
        alert('There was a problem with your purchase, you can contact support at support@heysabio.com');
      }
    }
  };

  // useEffect(() => {
  //   purchaseUpdatedListener(async (purchase) => {
  //     purchase.transactionReceipt;
  //     if (purchase.transactionReceipt) {
  //       const response = await call('POST', 'users/confirmSubscription', { userId: user.id, purchase });

  //       if (response) {
  //         dispatch(setup());
  //         setLoading(false);
  //         navigation.navigate('Chat');
  //       } else {
  //         setLoading(false);
  //         alert('There was a problem with your purchase, you can contact support at support@heysabio.com');
  //       }
  //     }
  //   });

  //   purchaseErrorListener((error) => {
  //     console.log('Purchase Error', error);
  //     setLoading(false);
  //   });

  //   return () => {
  //     purchaseUpdatedListener();
  //     purchaseErrorListener();
  //   };
  // }, []);

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
