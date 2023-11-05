import React, { useContext, useState } from 'react';
import moment from 'moment-timezone';
import { getDeviceTimezone } from '../utils/timezones';

const UIStateContext = React.createContext();

export const UIStateProvider = ({ children }) => {
  const deviceTimezone = getDeviceTimezone();

  const [selectedDate, setSelectedDate] = useState(moment.tz(deviceTimezone).format('YYYY-MM-DD'));
  const [openEventId, setOpenEventId] = useState(null);

  return (
    <UIStateContext.Provider value={{ selectedDate, openEventId, setSelectedDate, setOpenEventId }}>
      {children}
    </UIStateContext.Provider>
  );
};

export default () => useContext(UIStateContext);
