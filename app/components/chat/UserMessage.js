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
        marginLeft: 30,
        alignSelf: 'flex-end',
      }}>
      <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>{message}</Text>
    </View>
  );
};

export default UserMessage;
