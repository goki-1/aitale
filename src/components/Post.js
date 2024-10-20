import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator, Dimensions, AppState, AppStateStatus, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
//import { useNavigation } from '@react-navigation/native';
import {updateUser } from '../graphql/mutations';
import { getUser } from '../graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateClient } from 'aws-amplify/api';
import transformJsonFullyExtended from '../../trasformJson.js';
import transformJson from '../../transformJson2';
import VideoPlayer from '../../VideoPlayer';
import VideoPlayer2 from '../../VideoPlayer2';
import Tts from 'react-native-tts';
import { uploadData, getUrl } from 'aws-amplify/storage';
import AppContext from '../../AppContext';
import Story from '../../Story.json'

const Post = ({ id, tags, title, date, user, userid, image, saves, nextParts, showMyPosts=null, }) => {
  const client = generateClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  //const navigation = useNavigation();
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [data, setData] = useState(null); // State to hold fetched data

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const getStringResult = await getUrl({ key: id });
        // const response = await fetch(getStringResult.url);
        // if (response.ok) {
        //   const content = await response.text();
        const content = Story;
          //let dataa = transformJsonFullyExtended(JSON.parse(content), user );
          console.log("lkllk",content)
          let dataa = await transformJson(content)
          //dataa.panels = dataa.panels.filter(panel => panel.type !== "character dialogues");
        console.log("huyuyuy",dataa)
        
          setData(dataa);
        // } else {
        //   throw new Error('Failed to fetch data');
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const storedUserId = await readData('userdreamer');
        const response = await client.graphql({ query: getUser, variables: { id: storedUserId.id } });
        const userData = response.data.getUser;
        //const userData = "u"
        setCurrentUser(userData);
        setIsSaved(userData.savedPosts.includes(id));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  //const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      //setAppState(nextAppState);

      if (nextAppState === 'inactive' || nextAppState === 'background') {
        // The app has been moved to the background or is inactive
        console.log('App has been exited');
        setIsPlaying(true);
        Tts.stop();
        setVideoPlayerKey(prevKey => prevKey + 1);
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  // Handle save/unsave post
  const handleSavePress = async () => {
    setIsSaving(true);
    setIsSaved(!isSaved); // Optimistically update UI
    const updatedSavedPosts = isSaved ? currentUser.savedPosts.filter(postId => postId !== id) : [...currentUser.savedPosts, id];

    try {
      await client.graphql({
        query: updateUser,
        variables: { input: { id: currentUser.id, savedPosts: updatedSavedPosts } },
      });

      
      setCurrentUser({ ...currentUser, savedPosts: updatedSavedPosts });
    } catch (error) {
      // Revert optimistic UI update if the operation fails
      setIsSaved(isSaved);
      console.error('Error updating savedPosts:', error);
    }
    setIsSaving(false);
  };


  const formatPostDate = (inputDate) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Date(inputDate).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const formattedDate = formatPostDate(date);

  const handleBranchPress = () => {
    setIsModalVisible(true);
  };
  const handleContinuePress = () => {
    Alert.alert("This feature will be implemented soon.")
    //navigation.navigate('Create', {id});
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCreateWithInfo = () => {
    handleCloseModal();
  };
  useEffect(() => {
    console.log("isPlaying after state update:", isPlaying);
  }, [isPlaying]);

  //const [videoPlayerKey, setVideoPlayerKey] = useState(0);
  const [videoPlayerKey, setVideoPlayerKey] = useState(false);
  const handlePause = () => {
    //setVideoPlayerKey(prevKey => prevKey + 1);
    setVideoPlayerKey(!videoPlayerKey);
    if (isPlaying) {
    
      setIsPlaying(false);
    } else {
      Tts.stop();
      
      setIsPlaying(true);
      
    }
  };


  return (
    <View style={styles.postContainer} >
    {/* <TouchableOpacity style={[styles.followButton, { backgroundColor: isFollowing ? 'black' : '#F0B27A' }]} onPress={handleFollowPress}>
        <Text style={[styles.followButtonText, { color: isFollowing ? 'gray' : 'white' }]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity> */}
      {/* <View style={styles.userInfo}>
    
        <Text style={styles.detailsText}>{views} views</Text> 
      
      </View> */}
      <TouchableOpacity onPress={handlePause}>
      {isPlaying ? 
      <View>
        
      <Image source={{uri: image}} style={styles.postImage} resizeMode="cover" /> 
      <View style={styles.playButtonContainer}>
        <Text style={styles.playButton}>▶️</Text> 
      </View> 
      </View>
       :
         <View style={styles.postImage} resizeMode="cover">
           {/* <VideoPlayer data={data} keye={videoPlayerKey.toString()} />  */}
           <VideoPlayer2 data={data} playOrpause = {videoPlayerKey} />
          </View> 
      }
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        {/* <TouchableOpacity style={styles.row} onPress={handleLikePress}>
          <AntDesignIcon name={isLiked ? 'like1' : 'like2'} size={25} color={isLiked ? '#F0B27A' : 'gray'} />
          <Text style={styles.detailsTex}>{returnlikes()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={handleDislikePress}>
          <AntDesignIcon name={isDisliked ? 'dislike1' : 'dislike2'} size={25} color={isDisliked ? '#F0B27A' : 'gray'} />
          <Text style={styles.detailsTex}>{returndislikes()}</Text>
        </TouchableOpacity> */}
        
        <View style={styles.userinf}>
            <View style={styles.userCircle}>
            <Text style={styles.userInitial}>{user.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.username}>{user.length > 9 ? `${user.substring(0, 9)}..` : user}</Text>
        </View>
        <TouchableOpacity style={styles.borderButtonn} onPress={handleSavePress} disabled={isSaving}>
          {isSaving ? (
            
              <ActivityIndicator size="small" color="#F0B27A" />
          ) : (
            <AntDesignIcon name={isSaved ? 'star' : 'staro'} size={25} color={isSaved ? '#F0B27A' : 'gray'} />
          )}
          <Text style={styles.detailsTe}>Save  </Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={styles.borderButton} onPress={handleBranchPress}>
          <MaterialCommunityIcons name="animation-play" size={25} color="#ddd" />
          <Text style={styles.detailsTe}>Next  </Text>
        </TouchableOpacity>
        <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>{formattedDate}</Text>
        </View>
        
      </View>
      {showMyPosts === 'postsData' && <View><TouchableOpacity style={styles.borderButtonPost} onPress={handleContinuePress}>
          <Text style={styles.textPost}>Continue this Story</Text>
        </TouchableOpacity></View>}
      {/* Modal for branching and extending */}
      
      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={handleCloseModal} >
        {/* Add your modal content here */}
        <TouchableOpacity style={styles.model} onPress={handleCloseModal}>
        <View style={styles.modalContainer}>
          {/* Add your modal content */}
          <TouchableOpacity onPress={handleCreateWithInfo}>
            <Text style={styles.text}>This story has total {nextParts} parts. </Text> 
            <Text style={styles.text}>You can play next parts one after the another</Text>
            <Text style={styles.text}>Owner of the post can continue the story</Text>
            <Text style={styles.text}>Save the post to visit back</Text>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
        
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 4,
    backgroundColor: '#000',
    padding: 0,
    //borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  followButton: {
    position: 'absolute',
    top: 2,
    right: 10,
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor:'gray',
    borderWidth:1,
  },
  followButtonText: {
  },
  tag: {
    marginRight: 5,
    fontSize: 14,
    color: '#F0B27A',
  },
  title: {
    fontSize: 19,
    fontWeight:'500',
    marginBottom: 2,
    color: '#fff'
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  detailsText: {
    marginRight: 10,
    fontSize: 14,
    color: 'gray',
  },
  detailsTex: {
    marginTop:2,
    marginLeft: 10,
    fontSize: 14,
    color: 'gray',
  },
  detailsTe: {
    marginTop:2,
    marginLeft: 5,
    fontSize: 14,
    color: 'gray',
  },
  userInfo: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    
  },
  userinf: {
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center',
  },
  userCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F0B27A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    
  },
  userInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 14,
    color: '#fff',
    
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 19,
    padding: 1,
    paddingLeft:4,
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor:"#ddd"
    marginBottom:5,
  },
  borderButtonn: {
    height:30,
    width:74,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 19,
    padding: 1,
    paddingLeft:4,
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor:"#ddd"
    marginBottom:5,
  },
  borderButtonPost:{
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 19,
    alignItems: 'center',
    //backgroundColor:"",
    margin:9,
    marginTop:12,
  },
  row:{
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    margin: 5,
  },
  model:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContainer: {
    marginTop: '120%',
    height: '40%',
    alignItems: 'center',
    backgroundColor: '#aaa',
    borderRadius:20,
    paddingTop:30
  },
  postImage: {
    width: Dimensions.get('window').width / 1.00,
    height: Dimensions.get('window').height / 2.8,
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  text:{
    fontSize:17,
    marginTop:10,
    marginHorizontal:10,
  },
  textPost:{
    color:'#ccc',
    fontSize:23,
    //marginTop:10,
    margin:6,
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust based on the size of your play button
    zIndex: 1, // Ensure the play button is above the image
  },
  playButton: {
    fontSize: 39, // Adjust size as needed
  },
});
 
export default Post;
