import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { ScrollView, RefreshControl, View } from 'react-native';
import call from '../../../../utils/call';
import Post from '../components/Post';
import { useSelector } from 'react-redux';

const Container = styled.View`
  flex: 1;
  background-color: #16171b;
`;

const Scrollable = styled(ScrollView)`
  flex: 1;
  padding: 20px;
`;

const Feed = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);

  const user = useSelector((state) => state.user.user);

  const getInitialPosts = async () => {
    setRefreshing(true);
    let from = moment().subtract(2, 'week').format('YYYY-MM-DD');
    let to = moment().format('YYYY-MM-DD');

    const _posts = await call('GET', `users/feed/${from}/${to}`);

    setTimeout(() => {
      setPosts(_posts);
      setRefreshing(false);
    }, 1000);
  }

  useEffect(() => {
    getInitialPosts();
  }, []);

  const handleLoadMore = async () => {
    let from = moment().subtract(2, 'week').format('YYYY-MM-DD');
    let to = moment().format('YYYY-MM-DD');

    if (posts.length > 0) {
      from = moment(posts[posts.length - 1].date).subtract(2, 'week').format('YYYY-MM-DD');
      to = moment(posts[posts.length - 1].date).subtract(1, 'day').format('YYYY-MM-DD');
    }
    const _posts = await call('GET', `users/feed/${from}/${to}`);
    setPosts([...posts, ..._posts]);
  }

  const onRefresh = () => {
    getInitialPosts();
  };

  return (
    <Container>
      <Scrollable
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#fff'} />
        }
      >
        {posts.map((post, index) => (
          <Post key={index} post={post} userId={user.id} username={user.username} />
        ))}
        <View style={{ height: 20 }} />
      </Scrollable>
    </Container >
  );
};

export default Feed;
