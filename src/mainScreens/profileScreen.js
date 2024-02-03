import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, getPost } from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const client = generateClient();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(true);
  const [loading, setLoading] = useState(true);
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
  const [userId, setUserId] = useState(null);

useEffect(() => {
  // Fetch the userId from AsyncStorage
  const fetchUserId = async () => {
    setLoading(true);
    try {
      const storedUserId = await readData('userdreamer');
      console.log(storedUserId);
      setUserId(storedUserId); // Set userId in state
    } catch (error) {
      console.error('Error fetching userId from AsyncStorage:', error);
      setLoading(false);
    }
  };

  fetchUserId();
}, []);

useEffect(() => {
  // Once userId is set, fetch user data and posts
  if (userId) {
    const fetchUserData = async () => {
      try {
        const response = await client.graphql({
          query: getUser,
          variables: { id: userId.id },
        });
        const user = response.data.getUser;
        setCurrentUser(user);

        const postsDetails = await Promise.all(user.posts.map(postId =>
          client.graphql({ query: getPost, variables: { id: postId } })
        ));
        setPosts(postsDetails.map(result => result.data.getPost));

        // Fetch saved posts details
        const savedPostsDetails = await Promise.all(user.savedPosts.map(postId =>
          client.graphql({ query: getPost, variables: { id: postId } })
        ));
        setSavedPosts(savedPostsDetails.map(result => result.data.getPost));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }
}, [userId]);

  const handleSettingsPress = () => navigation.navigate('Settings');

  const handleHashtagPress = (index) => {
    const dataToPass = showMyPosts ? posts : savedPosts;
    navigation.navigate('ProfilePosts', { dataToPass, index, showMyPosts });
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
      <Text style={styles.username}>{currentUser?.username}</Text>
      <Text style={styles.name}>{currentUser?.name}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.circleButton}>
          <Text style={styles.initialLetter}>{currentUser?.username.charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, showMyPosts ? styles.activeButton : null]}
          onPress={() => setShowMyPosts(true)}
        >
          <Text style={[styles.buttonText, showMyPosts ? styles.activeButtonText : null]}>Posts</Text>
          <Text style={[styles.buttonText, showMyPosts ? styles.activeButtonText : null]}>{posts.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !showMyPosts ? styles.activeButton : null]}
          onPress={() => setShowMyPosts(false)}
        >
          <Text style={[styles.buttonText, !showMyPosts ? styles.activeButtonText : null]}>Saves</Text>
          <Text style={[styles.buttonText, !showMyPosts ? styles.activeButtonText : null]}>{savedPosts.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Credits</Text>
          <Text style={styles.buttonText}>{currentUser?.credits}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Followers</Text>
          <Text style={styles.buttonText}>{totalFollowers}</Text>
        </TouchableOpacity */}
      </View>

      <TouchableOpacity style={styles.but} onPress={() => {}}>
        
        <Text style={styles.buttonTex}>Buy more credits</Text>
      </TouchableOpacity>

      <Text style={styles.post}>{showMyPosts ? 'My Posts' : 'Saved Posts'}</Text>
      <FlatList
        data={showMyPosts ? posts : savedPosts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
        // Determine the data source based on the state
        const dataSource = showMyPosts ? posts : savedPosts;

        return (
          <TouchableOpacity onPress={() => handleHashtagPress(index)} style={styles.postContainer}>
            <Image 
              source={{ uri: item.thumbnailUrl }} 
              style={[
                styles.postImage,
                index === (dataSource.length - 1) && dataSource.length % 2 === 1
                  ? { height: 250 } // Adjust the height for the last item if odd number of posts
                  : null,
              ]} 
            />
            <View style={styles.postInfo}>
              <View style={styles.row}>
                <MaterialCommunityIcons name="animation-play" size={20} color="gray" />
                <Text style={styles.postDetails}>{item.nextParts}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
        }}
      />
      <TouchableOpacity style={styles.settingsIcon} onPress={handleSettingsPress}>
        <MaterialCommunityIcons name="cog" size={30} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#000',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0B27A',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginTop:10,
  },
  initialLetter: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop:20,
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom:10,
  },
  button: {
    marginTop:10,
    alignItems: 'center',
    
  },
  post:{
    fontSize:20,
    color:'white',
    alignSelf:'center',
    marginBottom:10,
  },
  activeButton: {
    borderBottomWidth: 2,  // Adjust the thickness of the border as needed
    borderBottomColor: '#F0B27A',  // Adjust the color of the border as needed
  },
  activeButtonText: {
    color: '#F0B27A',  // Adjust the color of the text for the active button
  },
  but:{
    width:'80%',
    alignSelf:'center',
    //backgroundColor:"gray",
    alignItems: 'center',
    margin: 10,
    marginBottom:10,
    marginTop:0,
    padding:10,
    borderWidth:3,
    borderColor: '#F0B27A',
    borderRadius:30,
  },
  buttonText: {
    color: 'white',
    //fontWeight:'bold',
    //fontSize:20,
  },
  buttonTex: {
    color: 'white',
    //fontWeight:'bold',
    fontSize:20,
  },
  name: {
    color: '#ddd',
    fontSize:15,
    marginLeft:20,
    marginTop:5,
  },
  postContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    margin: 1,
    width: '50%',
  },
  row: {
    borderRadius:10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    backgroundColor:"#ddd",
    justifyContent:'center',
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 3,
    margin: 0,
  },
  postInfo: {
    alignItems:'baseline',
    justifyContent:'flex-end',
    ...StyleSheet.absoluteFillObject,
    
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    backgroundColor:"#ddd",
  },
  postDetails: {
    color: 'gray',
    marginHorizontal:5,

  },
  signOutText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
  settingsIcon: {
    position: 'absolute',
    top: 21,
    right: 10,
  },
  loader:{
    marginTop:30,
  }
});

export default ProfileScreen;
