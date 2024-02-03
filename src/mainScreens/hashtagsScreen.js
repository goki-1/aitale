import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Post from '../components/Post';
import { generateClient } from "aws-amplify/api";
import { getPost } from '../graphql/queries'; // Assuming getPost is your query to fetch a post by ID

const HashtagsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;
  const client = generateClient();
  const hashtag = params?.hashtag;
  const postIds = params?.postIds;

  const [posts, setPosts] = useState([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const fetchPosts = async () => {
    if (nextIndex >= postIds.length) return;
    setLoading(true);
    try {
        const idsToFetch = postIds.slice(nextIndex, nextIndex + 3);
        const promises = idsToFetch.map(id =>
            client.graphql({
                query: getPost,
                variables: { id },
            })
        );
        const results = await Promise.all(promises);
        const newPosts = results.map(result => result.data.getPost).filter(post => post !== null); // Filter out null values

        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setNextIndex(prevIndex => prevIndex + 3);
    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEndReached = () => {
    if (!loading && nextIndex < postIds.length) {
      fetchPosts();
    }
  };

  const renderPost = ({ item }) => (
    <Post
      id={item.id}
      tags={item.hashtags}
      title={item.title}
      views={item.views}
      date={item.dateCreated}
      user={item.username}
      userid={item.userId}
      image={item.thumbnailUrl}
      likes={item.likes}
      dislikes={item.dislikes}
      saves={item.saves}
      content={item.postContent}
      nextParts={item.nextParts}
    />
  );

  return (
    <SafeAreaView style={styles.head}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <MaterialCommunityIcons name="arrow-left" color="#EB984E" size={30} />
        </TouchableOpacity>
        <Text style={styles.hashtagText}>
          {hashtag}
        </Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
      />
      {loading && <View style={styles.bottom}><ActivityIndicator size="large" color="#F0B27A"/></View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: '#6B6A6A',
    marginBottom: 6,
  },
  head: {
    backgroundColor: "#000",
    flex: 1,
  },
  bottom: {
    height: "5%",
  },
  backButton: {
    marginTop: 8,
    marginLeft: 0,
    flexDirection: 'row',
  },
  hashtagText: {
    width: '100%',
    textAlign: 'left',
    color: '#EB984E',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 25,
    marginLeft: 8,
  },
});

export default HashtagsScreen;
