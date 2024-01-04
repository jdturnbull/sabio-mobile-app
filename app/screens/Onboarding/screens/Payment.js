import React, { useEffect, useRef } from 'react';
import { Pressable, View, Text } from 'react-native';
import {
  initConnection,
  requestSubscription,
  purchaseErrorListener,
  purchaseUpdatedListener,
  useIAP,
} from 'react-native-iap';

const Payment = () => {
  const { getSubscriptions, subscriptions, connected } = useIAP();

  const subscribe = async () => {
    try {
      await initConnection();

      if (connected) {
        console.log('Connected to the store....');
        await getSubscriptions({ skus: ['com.heysabio.sabio.product.base'] });
        console.log(subscriptions);
      }

      await requestSubscription({
        sku: 'com.heysabio.sabio.product.base',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ padding: 100 }}>
      <Pressable style={{ borderWidth: 1, borderColor: 'red' }} onPress={() => subscribe()}>
        <Text>Subscribe</Text>
      </Pressable>
    </View>
  );
};

export default Payment;
