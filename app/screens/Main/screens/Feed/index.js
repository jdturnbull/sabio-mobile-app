import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getActions } from '../../../../stores/user/userSlice';
import Action from './components/Action';

const Feed = () => {
  const dispatch = useDispatch();
  const actions = useSelector((state) => state.user.actions);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getActions());
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    dispatch(getActions());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          Sabio's <Text style={{ color: '#E66642', fontWeight: '600' }}>actions</Text>
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl tintColor={'#ffffff40'} refreshing={refreshing} onRefresh={onRefresh} />}>
        {actions.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#ffffff60', fontWeight: '600', fontSize: 16 }}>
              Sabio hasn't taken any actions yet
            </Text>
          </View>
        ) : (
          actions.map((action) => <Action key={action.id} action={action} />)
        )}
      </ScrollView>
    </View>
  );
};

export default Feed;

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
  scrollView: {
    flex: 1,
    padding: 30,
  },
});
