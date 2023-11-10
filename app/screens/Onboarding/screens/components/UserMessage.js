import React from 'react';
import { View, Text } from 'react-native';

const UserMessage = ({ message }) => {
  return (
    <View
      style={{
        backgroundColor: '#E66642',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        marginRight: 30,
        alignSelf: 'flex-start',
      }}>
      <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>{message}</Text>
    </View>
  );
};

export default UserMessage;
