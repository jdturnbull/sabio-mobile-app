import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import call from '../../../../utils/call';
import { useSelector } from 'react-redux';

const developers = ['jdturnbull98@gmail.com', 'p17.turnbull@gmail.com'];

const Settings = () => {
  const user = useSelector((state) => state.user.session?.user);

  const handleDelPress = async () => {
    const resp = await call('GET', `users/delete/${user.id}`);

    if (resp) {
      alert('Account deleted, please reload the app');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          Your <Text style={{ color: '#E66642', fontWeight: '600' }}>Settings</Text>
        </Text>
      </View>
      <View style={{ flex: 1, padding: 30 }}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Hello, {user?.name}</Text>
        {developers.includes(user.email) && (
          <Pressable
            style={{ padding: 15, backgroundColor: '#1F2025', borderRadius: 10, marginTop: 20 }}
            onPress={handleDelPress}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Reset my account</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 85,
    marginTop: 45,
    backgroundColor: '#0f1013',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowColor: 'black',
  },
  header: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 25,
    marginHorizontal: 10,
    padding: 20,
  },
});
