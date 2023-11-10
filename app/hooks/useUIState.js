import React, { useContext, useState } from 'react';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

const UIStateContext = React.createContext();

export const UIStateProvider = ({ children }) => {
  const { timezone: deviceTimezone } = useSelector((state) => state.user);

  const [selectedDate, setSelectedDate] = useState(moment.tz(deviceTimezone).format('YYYY-MM-DD'));
  const [openEventId, setOpenEventId] = useState(null);

  return (
    <UIStateContext.Provider value={{ selectedDate, openEventId, setSelectedDate, setOpenEventId }}>
      {children}
    </UIStateContext.Provider>
  );
};

export default () => useContext(UIStateContext);
