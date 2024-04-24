import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions, Alert, ActivityIndicator, Button } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { listUsers, listHashtags, getHashtag } from '../graphql/queries';
import { createPost } from '../graphql/mutations';
import { createHashtag, updateUser, updateHashtag } from '../graphql/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateClient } from 'aws-amplify/api';
import { handleGenerateComicStory } from './handleGenerateComicStory';

const CreateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isDisabled, setIsDisabled] = useState(false);
  const [creating, setCreating] = useState('');
  const { params } = route;
 
  
  const [postid, setPostId] = useState(params?.id);
  //const [postToContinue, setPostToContinue] = useState(dummyPosts.filter(post => post.id === postid));
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
    //setPostToContinue(dummyPosts.filter(post => post.id === params?.id));

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
    setIsDisabled(true);
    if(!user?.credits >= 5){
      Alert.alert("You have low credits 🥲. Watch an Ad on profile page to get required credits.");
      setIsDisabled(false);
      return;
    }
    if (storyText.trim() === '') {
      Alert.alert("You forgot to write story 🥲");
      setIsDisabled(false);
      return;
    }
    setCreating("Now let AI cook");
    const client = generateClient();
    const postdetails = await handleGenerateComicStory(storyText);

    const userData = await readData('userdreamer');
    
      try {
        const postData = {
          title: postdetails.title,
          thumbnailUrl: 'https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/'+ postdetails.panels[0].genId,
          userId: user.id,
          username: user.username,
          saves: 0,
          nextParts: 0,
          previous: null,
          next: null,
          hashtags: [postdetails.hashtag],
        };
    
        const result = await client.graphql({
          query: createPost,
          variables: { input: postData }
        });

        console.log('Post created successfully:', result.data.createPost);

        const postId = result.data.createPost.id;

        const t = JSON.stringify(postdetails)
        try {
          const result = await uploadData({
            key: postId,
            data: t,
          }).result;
          console.log('Succeeded: ', result);
        } catch (error) {
          console.log('Error : ', error);
        }

        await storeData('dreamer' + postId, result.data.createPost);
        const updatedUserFields = {
          posts: [...userData.posts, postId],
        };
        await updateUserData('userdreamer', updatedUserFields);
        await client.graphql({
          query: updateUser,
          variables: { input: { id: user.id, ...updatedUserFields } },
        });

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
        
        setCreating("Story is ready to view in your posts");
        setIsDisabled(false);

      } catch (error) {
        console.error('Error creating post:', error);
        //Alert.alert("Error while generating the story", error)
        setIsDisabled(false);
      }
    
  };

  const handleContinue = () => {
    console.log('Creating story:', postToContinue);
  };

  const handleCancel = () => {
    setStoryText('');
    setPostId(null);
    //setPostToContinue([]);
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
          <Button style={styles.createButton} onPress={handleContinue} title="Continue" disabled={isDisabled}/>
            
        ) : (
          <Button style={styles.createButton} onPress={handleCreate} title="Create" disabled={isDisabled}/>
            
        )}

        <View style={styles.creditsContainer}>
        <Text style={styles.creditsText}>Remaining Credits: {user?.credits}</Text>
        {/* <Text style={styles.creditsTex}>Longer stories will consume more credits.</Text> */}
        <Text style={styles.creditsTex}>Major updates will come soon, if the App receives enough traction</Text>
        {/* <Text style={styles.creditsTex}>Watch an Ad to get credits</Text> */}
        {/* <Text style={styles.creditsTex}>Continuing existing stories require fewer credits</Text> */}
        {/* <Text style={styles.creditsTex}>NSFW content is not allowed</Text> */}
        <Text style={styles.credit}>{creating}</Text>
        {creating == "Now let AI cook" && <ActivityIndicator color="#F0B27A"/>}
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
  credit: {
    marginTop: 10,
    color: 'white',
    fontSize: 24,
  },
});

export default CreateScreen;
