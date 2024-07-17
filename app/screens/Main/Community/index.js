import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Feed from './screens/Feed';

const CommunityStack = createStackNavigator();

const Community = () => {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Feed">
      <CommunityStack.Screen name="Feed" component={Feed} />
    </CommunityStack.Navigator>
  );
};

export default Community;
