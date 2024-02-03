import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import dummyPosts from '../../Dataposts';
import dummyUsers from '../../Data';
import { listUsers, listHashtags, getHashtag } from '../graphql/queries';
import { createPost } from '../graphql/mutations';
import { createHashtag, updateUser, updateHashtag } from '../graphql/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateClient } from 'aws-amplify/api';

const CreateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;
  const currentUser = dummyUsers.find(user => user.id === 'user2');
  
  const [postid, setPostId] = useState(params?.id);
  const [postToContinue, setPostToContinue] = useState(dummyPosts.filter(post => post.id === postid));
  const [storyText, setStoryText] = useState('');
  const [user, setUser] = useState(null);
  const screenHeight = Dimensions.get('window').height;
  const maxTextInputHeight = screenHeight * 0.5;

  useEffect(() => {
    if (storyText.length > 0 && storyText.length <= 500) {
      setStoryText(storyText.slice(0, 500));
    }
  }, [storyText]);

  useEffect(() => {
    setPostId(params?.id);
    setPostToContinue(dummyPosts.filter(post => post.id === params?.id));

  }, [params]);

  useEffect(() => {
    const fetchUserData = async () => {
    const userData = await readData('userdreamer');
    setUser(userData);
    }
    fetchUserData();
  }, []);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log(`Data stored successfully for key: ${key}`);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
    }
  };
  
  const updateUserData = async (key, updatedFields) => {
    try {
      const storedData = await AsyncStorage.getItem(key);
      if (storedData) {
        const currentData = JSON.parse(storedData);
        const updatedData = { ...currentData, ...updatedFields };
        await storeData(key, updatedData);
        console.log(`Data updated successfully for key: ${key}`);
      } else {
        console.error(`No data found for key: ${key}`);
      }
    } catch (error) {
      console.error(`Error updating data for key ${key}:`, error);
    }
  };

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
  const handleCreate = async () => {
    const client = generateClient();

    //const userData = await readData('userdreamer');
    
      try {
        const postData = {
          title: 'Temporary heheheeg',
          thumbnailUrl: 'https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b0b28199-be76-41c9-b87a-b0f7a30a9e03/Leonardo_Diffusion_XL_the_city_streets_with_towering_skyscrape_0.jpg',
          userId: user.id,
          username: user.username,
          views: 0,
          dateCreated: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          saves: 0,
          nextParts: 0,
          hashtags: ['#superman', '#ironman', '#Loki'],
          postDetails: {
            title: 'Post Details Title',
            content: 'Post Details Content',
          },
        };
    
        const result = await client.graphql({
          query: createPost,
          variables: { input: postData }
        });

        console.log('Post created successfully:', result.data.createPost);

        const postId = result.data.createPost.id;
        await storeData('dreamer' + postId, result.data.createPost);
        const updatedUserFields = {
          posts: [...userData.posts, postId],
        };
        await updateUserData('userdreamer', updatedUserFields);
        await client.graphql({
          query: updateUser,
          variables: { input: { id: user.id, ...updatedUserFields } },
        });

        // Add hashtags and link them to the post
        const hashtagList = result.data.createPost.hashtags;
        for (const hashtag of hashtagList) {
          // Check if the hashtag exists with OR condition
          const hashtagExistsResult = await client.graphql({
            query: listHashtags,
            variables: {
              filter: {
                or: [
                  { hashtag: { eq: hashtag } },
                  // Add more conditions if needed
                ],
              },
            },
          });
        
          const existingHashtags = hashtagExistsResult.data.listHashtags.items;
          const existingHashtag = existingHashtags[0]; // Assuming the hashtag is unique
        
          if (existingHashtag) {
            // If hashtag exists, add postId to its postIds array
            const updatedHashtagFields = {
              postIds: [...existingHashtag.postIds, postId],
            };
            await client.graphql({
              query: updateHashtag,
              variables: { input: { id: existingHashtag.id, ...updatedHashtagFields } },
            });
          } else {
            // If hashtag doesn't exist, create a new entry
            const newHashtagData = {
              hashtag,
              imageUrl: result.data.createPost.thumbnailUrl,
              postIds: [postId],
            };
            await client.graphql({
              query: createHashtag,
              variables: { input: newHashtagData },
            });
          }
        }
        
        console.log('Hashtags created/updated successfully');
        

      } catch (error) {
        console.error('Error creating post:', error);
      }
    
  };

  const handleContinue = () => {
    console.log('Creating story:', postToContinue);
  };

  const handleCancel = () => {
    setStoryText('');
    setPostId(null);
    setPostToContinue([]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView>
      {postid != null ? (
        <>
          <Text style={styles.headerText}>
            Continuing the post
          </Text>
          <View style={styles.row}>
          <Text style={styles.headerTex}>
          {postToContinue[0].title}
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonTex}>Cancel</Text>
          </TouchableOpacity>
          </View>
        </>
        ) : (
          <Text style={styles.headerText}>
            Bring ideas to life
          </Text>
        )}

        <TextInput
          style={[styles.inputText, { maxHeight: maxTextInputHeight }]}
          multiline={true}
          numberOfLines={10}
          placeholder="Start typing your story..."
          value={storyText}
          onChangeText={setStoryText}
        />

        {postid != null ? (
          <TouchableOpacity style={styles.createButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        )}

        <View style={styles.creditsContainer}>
        <Text style={styles.creditsText}>Remaining Credits: {user?.credits}</Text>
        <Text style={styles.creditsTex}>Longer stories will consume more credits.</Text>
        <Text style={styles.creditsTex}>Continuing existing stories require fewer credits.</Text>
        <Text style={styles.creditsTex}>NSFW content is not allowed.</Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    backgroundColor: 'black', // Set background color to black
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  row:{
    //display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  headerTex: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0B27A',
    marginBottom: 15,
  },
  inputText: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    textAlignVertical: 'top',
    color: 'black',
  },
  createButton: {
    borderWidth:3,
    borderColor: '#F0B27A',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    
  },
  cancelButton: {
    borderWidth:1.5,
    borderColor: '#F0B27A',
    padding: 5,
    borderRadius: 25,
    alignSelf:"center",
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTex: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  creditsContainer: {
    marginTop: 10,
  },
  creditsText: {
    marginTop: 5,
    color: 'white',
    fontSize: 14,
  },
  creditsTex: {
    marginTop: 1,
    color: 'white',
    fontSize: 14,
  },
});

export default CreateScreen;
