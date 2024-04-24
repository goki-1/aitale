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
      title={"Aquaman and Ironamn"}
      date={'2024-03-25T12:00:00Z'}
      user={"ush33423"}
      userid={"item.userId"}
      image={"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/6685b6d9-ed89-4641-b6ce-4ee85f2f2a30/Default_Approaching_a_fogcovered_island_with_hidden_coves_gro_0.jpg"}
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
