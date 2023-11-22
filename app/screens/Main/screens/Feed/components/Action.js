import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { getIconFromLabel } from '../../../../../utils/icon';

const Action = ({ action }) => {
  const { navigate } = useNavigation();
  const Icon = getIconFromLabel(action.type) || getIconFromLabel('default');

  const handlePress = () => {
    navigate('OverlayStack', { screen: 'action', params: { action } });
  };

  const createdAt = moment(action.createdAt).fromNow();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon />
        <Text style={styles.title}>{action.title}</Text>
      </View>
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: '#ffffff20',
          borderRadius: 20,
          marginTop: 10,
          marginBottom: 10,
        }}
      />
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Text style={styles.pressableText}>View</Text>
      </Pressable>
      <Text style={{ color: '#ffffff40', fontWeight: '600', fontSize: 14, marginTop: 20, alignSelf: 'flex-end' }}>
        {createdAt}
      </Text>
    </View>
  );
};

export default Action;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2025',
    borderRadius: 8,
    padding: 16,
    paddingBottom: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  pressable: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#E66642',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableText: {
    color: '#E66642',
    fontWeight: '500',
    fontSize: 16,
  },
});
