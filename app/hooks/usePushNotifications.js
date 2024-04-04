import { useEffect } from 'react';
import { Notifications } from 'react-native-notifications';
import { getUniqueId } from 'react-native-device-info';
import call from '../utils/call';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default () => {
  const session = useSelector((state) => state.user.session);
  useEffect(() => {
    Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      console.log(event);
      const deviceId = getUniqueId();
      console.log('Running');
      console.log(event.deviceToken);
      AsyncStorage.setItem('deviceToken', event.deviceToken);
    });

    Notifications.getInitialNotification()
      .then((notification) => {
        if (notification) {
          const { type } = notification.payload;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      // TODO: we should show a local notification here
      completion({ alert: false, sound: false, badge: false });
    });

    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      completion({ alert: true, sound: true, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      if (notification) {
        // const { screen, navigationParams } = notification.payload;
        // mixpanel.track('notification_opened', { screen, navigationParams });
        // if (screen) {
        //   setTimeout(() => {
        //     navigateRoot(screen, navigationParams);
        //   }, 1000);
        // }
      }

      completion();
    });
  }, [session]);
};
