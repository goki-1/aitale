import React, {useState, useEffect} from 'react';
import { View, FlatList, SafeAreaView, StyleSheet, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import Post from '../components/Post'; 
import Icon from 'react-native-vector-icons/Ionicons';
import {generateClient} from "aws-amplify/api";
import { listPosts, listHashtags} from '../graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [nextToken, setNextToken] = useState(null); // New state for nextToken
  const client = generateClient();
  const [refreshing, setRefreshing] = useState(false);
  const MAX_RETRIES = 3; // Maximum number of attempts
  let attempt = 0;

  const renderPost = ({ item }) => (
    <Post
      id={item.id}
      tags={item.hashtags}
      title={item.title}
      date={item.dateCreated}
      user={item.username}
      userid={item.userId}
      image={item.thumbnailUrl}
      saves={item.saves}
      nextParts={item.nextParts}
    />
  );

  const readData = async (key) => {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      const data = JSON.parse(jsonData);
      return data;
    } catch (error) {
      console.error('Error reading data from AsyncStorage:', error);
      return null;
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setPosts([]);
    const newStartToken = null; // Reset pagination if applicable
    await fetchPosts(visiblePosts, newStartToken); // Adjust to fetch and set new data
    setRefreshing(false);
  };
  const handleEndReached = () => {
    if (!loading && nextToken) {
      fetchPosts(visiblePosts, nextToken); // Fetch more posts when the end is reached
    }
  };

  const fetchPosts = async (limit, token) => {
    setLoading(true);
    try {
      const result = await client.graphql({
        query: listPosts,
        variables: { limit, nextToken: token },
      });

      const newPosts = result.data.listPosts.items;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setNextToken(result.data.listPosts.nextToken); // Update nextToken
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        attempt++;
        console.log(`Attempt ${attempt}: Retrying fetchPosts...`);
        await fetchPosts(limit, token);
      }
        else{
      Alert.alert("Network error");
        }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch initial set of posts
      await fetchPosts(visiblePosts, null);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.head}>
      <View style={styles.header}>
        <Icon name="sparkles" color="#EB984E" size={26} />
        <Text
          style={{
            width: '100%',
            textAlign: 'left',
            color: '#EB984E',
            marginTop: 10,
            marginBottom: 5,
            fontSize: 25,
            marginLeft: 8,
          }}>
          Draema
        </Text>
      </View>
      <FlatList
        data={posts} 
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
        <View style={styles.loadingIndicator}>
          {loading && <ActivityIndicator color="#F0B27A"/>}
        </View>
      )}
      refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#F0B27A" // Optional: customize the indicator color
    />
  }
    />
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    borderBottomWidth:0.7,
    borderBottomColor:'#6B6A6A',
    marginBottom:6,
    backgroundColor:"#000",
  },
  head: {
    backgroundColor:"#000",
    flex:1,
  },
  bottom:{
    height:"20%",
  },
  botto:{
    height:"30%",
  },
  loadingIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50, // Adjust the height as needed
  },
});

export default HomeScreen;
