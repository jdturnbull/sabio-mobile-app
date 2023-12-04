import React from 'react';
import { View, Text } from 'react-native';

const AssistantMessage = ({ message }) => {
  return (
    <View
      style={{
        backgroundColor: '#1F2025',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        marginRight: 30,
        alignSelf: 'flex-end',
      }}>
      <Text style={{ color: '#ffffff', fontWeight: '500', fontSize: 18, fontFamily: 'Noto Sans' }}>{message}</Text>
    </View>
  );
};

export default AssistantMessage;
