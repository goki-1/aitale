import React, {useState, useMemo, useEffect} from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity,ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {generateClient} from "aws-amplify/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listHashtags} from '../graphql/queries';

const ExploreScreen = () => {
  const client = generateClient();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);


  const fetchPosts = async ( ) => {
    setLoading(true);
    try {
      const result = await client.graphql({
        query: listHashtags,
        variables: { limit:30 },
      });

      const newPosts = result.data.listHashtags.items;
      console.log("explore screeeen");
      setPosts(newPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch initial set of posts
      await fetchPosts();
    };

    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedSearchText = searchText.toLowerCase();
  
    return posts.filter(post =>
      post.hashtag && post.hashtag.toLowerCase().includes(normalizedSearchText)
    );
  }, [searchText, posts]);
  

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleHashtagPress = (hashtag, postIds) => {
    // Navigate to the settings page
    navigation.navigate('Hashtags', {hashtag, postIds });
  };
  if (loading) {
    return (
    <KeyboardAvoidingView style={styles.container}>
      <ActivityIndicator style={styles.loader} size="large" color="#F0B27A" />
    </KeyboardAvoidingView>
    )
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={27} color="gray" />
        <Text
          style={styles.searchInpu}
        >#
        </Text>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor="gray"
          onChangeText={handleSearch}
        />
      </View>

      {/* List of posts in 3 columns */}
      <FlatList
        data={filteredPosts}
        numColumns={2}
        keyExtractor={(item) => item.hashtag}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleHashtagPress(item.hashtag, item.postIds)}
            style={styles.postContainer}>
            <Image source={{uri: item.imageUrl}} style={[
            index === filteredPosts.length - 1 && filteredPosts.length % 2 === 1 ? { width: '100%', height: 200 } : { width: '100%', height: 140 }]
            } />
            <View style={styles.tagOverlay}>
              <Text key={index} style={styles.tagText}>
                {item.hashtag}
              </Text>
            </View>
            {/* Add conditional style to position the last item on the right */}
          </TouchableOpacity>
        )}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 18,
  },
  searchInput: {
    flex: 1,
    marginLeft: 1,
    fontSize: 16,
    color: 'white',
  },
  searchInpu: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
  },
  postContainer: {
    flex: 1,
    margin: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 140,
    borderRadius: 3,
  },
  tagOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  tagText: {
    flex:1,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
});

export default ExploreScreen;
