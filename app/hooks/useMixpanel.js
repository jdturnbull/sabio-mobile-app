import React, { createContext, useContext, useEffect, useState } from 'react';
import { Mixpanel } from 'mixpanel-react-native';
import { REACT_APP_MIXPANEL_API_KEY } from '@env';

const MixpanelContext = createContext(null);

export const MixpanelProvider = ({ children }) => {
  const [mixpanelInstance, setMixpanelInstance] = useState(null);

  useEffect(() => {
    const initMixpanel = async () => {
      const mixpanel = new Mixpanel(REACT_APP_MIXPANEL_API_KEY, false);
      mixpanel.init();

      setMixpanelInstance(mixpanel);
    };

    initMixpanel();
  }, []);

  return <MixpanelContext.Provider value={mixpanelInstance}>{children}</MixpanelContext.Provider>;
};

export const useMixpanel = () => {
  const mixpanel = useContext(MixpanelContext);

  if (!mixpanel) {
    throw new Error('useMixpanel must be used within a MixpanelProvider');
  }

  const identify = ({ userId, email, name }) => {
    mixpanel.identify(userId);

    mixpanel.getPeople().set({
      $email: email,
      $name: name,
    });
  };

  const track = (eventName, properties) => {
    mixpanel.track(eventName, properties);
  };

  // Include other Mixpanel functionalities as needed
  return { track, identify };
};
