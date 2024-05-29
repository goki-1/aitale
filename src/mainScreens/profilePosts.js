import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Post from '../components/Post';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfilePosts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;
  const flatListRef = useRef();
  const posts = params?.dataToPass;
  const index = params?.index;
  const showMyPosts = params?.showMyPosts;
  const len = showMyPosts? 450:387;
  const show = showMyPosts? 'postsData':'hh';
  //const currentUser = params?.userid; 
  console.log(index);
  const handleBackPress = () => {
    navigation.goBack();
  };
  useEffect(() => {
    flatListRef.current.scrollToIndex({ animated: true, index });
  }, []);
  
  const renderPost = ({ item }) => (
    <Post
      id={item.id}
      tags={item.hashtags}
      title={item.title}
      date={item.createdAt}
      user={item.username}
      userid={item.userId}
      image={item.thumbnailUrl}
      saves={item.saves}
      nextParts={item.nextParts}
      showMyPosts={show}
    />
  );

  return (
    <SafeAreaView style={styles.head}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
      <MaterialCommunityIcons name="arrow-left" color="#EB984E" size={30} />
      </TouchableOpacity>
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
          Posts
        </Text>

      </View>
      <FlatList
        ref={flatListRef}
        data={posts} // Display only the visible posts
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        getItemLayout={(data, index) => (
        { length: len, offset: (index)*len, index }
          )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderBottomWidth:0.7,
    borderBottomColor:'#6B6A6A',
    marginBottom:6,
  },
  head: {
    backgroundColor:"#000",
    flex:1,
  },
  
  botto:{
    height:"5%",
  },
  backButton: {
    marginTop: 8,
    marginLeft: 0,
    flexDirection: 'row',
  },
  followButton: {
    position: 'absolute',
    top: 14,
    right: 30,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor:'gray',
    borderWidth:1,
  },
  followButtonText:{
  },
});

export default ProfilePosts