import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { getIconFromLabel } from '../../../../../../../utils/icon';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#1F2025',
    marginBottom: 15,
    padding: 20,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    marginLeft: 15,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  body: {},
  bodyText: {
    fontWeight: '700',
    color: '#ffffff40',
    fontSize: 14,
  },
});

const Card = ({ activity }) => {
  const { navigate } = useNavigation();
  let Icon = getIconFromLabel(activity.type.toLowerCase()) || getIconFromLabel('default');

  const handlePress = () => {
    navigate('OverlayStack', { screen: 'activity', params: { activity } });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Icon />
        <Text style={styles.title}>{activity.title}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>{activity.guidance}</Text>
      </View>
    </Pressable>
  );
};

export default Card;
