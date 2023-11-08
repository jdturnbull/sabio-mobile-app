import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import HealthKit, {
  HKUnit,
  HKQuantityTypeIdentifier,
  HKInsulinDeliveryReason,
  HKCategoryTypeIdentifier,
} from '@kingstinct/react-native-healthkit';

import SafariView from 'react-native-safari-view';
import AnimatedPressable from '../components/AnimatedPressable';
import { useSelector } from 'react-redux';
import call from '../../../utils/call';

const FirstScreen = ({ handleNext }) => {
  const user = useSelector((state) => state.user.session.user);

  const screenWidth = useWindowDimensions().width;

  const handleConnectApple = async () => {
    const isAvailable = await HealthKit.isHealthDataAvailable();

    // Looks like with apple health kit i need to run background processes on the phone to get the data for adjusting workouts
    // Might have to delay this one
  };

  const handleConnectGarmin = () => {};

  const handleConnectFitbit = async () => {
    const url = await call('GET', `connect/fitbit/auth/${user.id}`);

    SafariView.show({
      url: url,
    });

    SafariView.addEventListener('onShow', () => {
      const interval = setInterval(async () => {
        const connections = await call('GET', `connect/list/${user.id}`);
        if (connections.length > 0) {
          SafariView.dismiss();
          handleNext();
          clearInterval(interval);
        }
      }, 1000);
    });
  };

  const handleConnectStrava = () => {};

  const handleIDontUseOne = () => {
    handleNext();
  };

  return (
    <View style={{ ...styles.container, width: screenWidth }}>
      <AnimatedPressable icon={'apple'} label={'Apple watch'} onPress={handleConnectApple} />
      <AnimatedPressable icon={'garmin'} label={'Garmin watch'} onPress={handleConnectGarmin} />
      <AnimatedPressable icon={'fitbit'} label={'Fitbit'} onPress={handleConnectFitbit} />
      <AnimatedPressable icon={'strava'} label={'Strava'} onPress={handleConnectStrava} />
      <AnimatedPressable icon={'stop'} label={"I don't use one"} onPress={handleIDontUseOne} />
    </View>
  );
};

export default FirstScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
