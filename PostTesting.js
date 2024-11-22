import React, {useState, useEffect} from 'react';
import { View, FlatList, SafeAreaView, StyleSheet, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import Post from './src/components/Post'; 
import Icon from 'react-native-vector-icons/Ionicons';


const PostTesting = () => {

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
      <Post
      id={"sssss"}
      tags={["Ironaman"]}
      title={"{Title of the Video here}"}
      date={'2024-03-25T12:00:00Z'}
      user={"ush33423"}
      userid={"item.userId"}
      image={"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/bd9855f4-ae94-4e3d-a03f-e07ba1cece84/Leonardo_Lightning_XL_night_The_dark_world_is_intimidating_wit_0.jpg"}
      saves={0}
      nextParts={0}
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

});

export default PostTesting;
