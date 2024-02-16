import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomLoading from './CustomLoading';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeScreen from '../mainScreens/homeScreen';
import ExploreScreen from '../mainScreens/exploreScreen';
import HashtagsScreen from '../mainScreens/hashtagsScreen';
import ProfileScreen from '../mainScreens/profileScreen';
import CreateScreen from '../mainScreens/createScreen';
import SettingsScreen from '../mainScreens/settingsScreen';
import ProfilePosts from '../mainScreens/profilePosts';
import {getCurrentUser, fetchUserAttributes, updateUserAttributes, signOut} from 'aws-amplify/auth';
import {Hub} from 'aws-amplify/utils';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser } from '../graphql/mutations';
import { getUser } from '../graphql/queries';
import {generateClient} from "aws-amplify/api";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const StackProfile = createNativeStackNavigator();
const StackExplore = createNativeStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState(undefined);
  const client = generateClient();
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
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error reading data from AsyncStorage:', error);
      return null;
    }
  };
   // Function to generate a random string of specified length
   const generateRandomString = length => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  const checkUser = async () => {
    
    console.log("sssss");
    try {
      const authUser = await getCurrentUser();
      console.log("authUser ", authUser);
      const user = await fetchUserAttributes();
      console.log("user ", user);
      const generatedUsername = user.name.slice(0, 4).toLowerCase().replace(/\s/g, '_') + generateRandomString(5);
      if (user.given_name && user.given_name.length < 10){
        let userData = {
          email: user.email,
          userId: user.sub,
          username: generatedUsername,
          name: user.name,
          posts: [],
          savedPosts: [],
          interests: [],
          followers: [],
          likedPosts: [],
          dislikedPosts: [],
          viewedPosts: [],
          credits: 10,
        };
        try{
        const resul = await client.graphql({
          query: createUser,
          variables: { input: userData }
        });
        console.log('User created successfully:', resul.data.createUser);

        const userId = resul.data.createUser.id;
        userData.id = userId;
        await storeData('userdreamer',userData);
        const result = await updateUserAttributes({userAttributes:{
          given_name: userId}
        });
        const userw = await fetchUserAttributes();
        console.log(userw);
      }
      catch(e){
        console.log("wwwwwwwwwwwwweoro", e);
      }
      }
      else{
        if((await readData('userdreamer')) == null && user){
          console.log("entering in else if");
          const user = await fetchUserAttributes();
          const response = await client.graphql({
            query: getUser,
            variables: { id: user.given_name },
          });
          const use = response.data.getUser;
          await storeData('userdreamer', use);
        }
      }
      console.log("----------------------------")
      setUser(authUser);
    } catch (e) {
      console.log("erororor ",e);
      
      setUser(null);
    }
  };
  const ProfileStack = () => {
    return (
      <StackProfile.Navigator screenOptions={{ headerShown: false }}>
        <StackProfile.Screen name="Profiles" component={ProfileScreen} />
        <StackProfile.Screen name="Settings" component={SettingsScreen} />
        <StackProfile.Screen name="ProfilePosts" component={ProfilePosts} />
      </StackProfile.Navigator>
    );
  }

  const ExploreStack = () => {
    return (
      <StackExplore.Navigator screenOptions={{ headerShown: false }}>
        <StackExplore.Screen name="Explores" component={ExploreScreen} />
        <StackExplore.Screen name="Hashtags" component={HashtagsScreen} />
      </StackExplore.Navigator>
    );
  }


  useEffect(() => {
    
    checkUser();
  }, []);

  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signedIn' || data.payload.event === 'signedOut') {
        checkUser();
      }
    };

    Hub.listen('auth', listener);
    
  }, []);

  if (user === undefined) {
    return <CustomLoading />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Explore') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'Create') {
                iconName = focused ? 'sparkles' : 'sparkles-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              // You can customize the color and size here
              const customColor = focused ? '#F0B27A' : 'gray';
              const customSize = 27;

              return <Icon name={iconName} color={customColor} size={customSize} />;
            },
            tabBarLabel: '', // Hide the screen names
            headerShown: false,
            tabBarStyle:{
              backgroundColor: '#000',
            },
            tabBarHideOnKeyboard: true,
          })}  
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Explore" component={ExploreStack} />
          <Tab.Screen name="Create" component={CreateScreen} />
          <Tab.Screen name="Profile" component={ProfileStack} />
          
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
          </>
        </Stack.Navigator>
      )}
      
    </NavigationContainer>
  );
};

export default Navigation;
