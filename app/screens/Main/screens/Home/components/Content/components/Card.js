import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { getIconFromLabel } from '../../../../../../../utils/icon';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#1F2025',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#FFFFFF30',
    marginBottom: 15,
    padding: 30,
    borderRadius: 27,
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
    fontSize: 18,
    marginBottom: 20,
  },
  body: {},
  bodyText: {
    fontWeight: '700',
    color: '#ffffff40',
    fontSize: 14,
    marginRight: 10,
  },
});

const Card = ({ activity }) => {
  const { navigate } = useNavigation();
  const NextIcon = getIconFromLabel('next');
  const Icon = getIconFromLabel(activity.type.toLowerCase()) || getIconFromLabel('default');

  const handlePress = () => {
    navigate('OverlayStack', { screen: 'activity', params: { activity } });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{activity.title}</Text>
      <Icon />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 30 }}>
        <Text style={styles.bodyText} numberOfLines={1}>
          {activity.guidance}
        </Text>
      </View>
    </Pressable>
  );
};

export default Card;
