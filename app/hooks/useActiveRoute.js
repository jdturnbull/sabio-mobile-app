import React, { useContext } from 'react';

const ActiveRouteContext = React.createContext();

// TODO: add option for custom component here
export const ActiveRouteProvider = ({ activeRoute, children }) => {
  return <ActiveRouteContext.Provider value={activeRoute}>{children}</ActiveRouteContext.Provider>;
};

export default () => useContext(ActiveRouteContext);
