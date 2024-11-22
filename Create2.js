import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, Image, Switch, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { OPENAI_KEY, LEONARDO_API } from '@env';
import { uploadData, getUrl } from 'aws-amplify/storage';
import {combine, generateImagesForCharacter, processComicBookStory, verifyImageUrls} from './CreateHelper2';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//const generateCustomSchema = require('./schemaC');
function addRightFacingPose(characters) {
  characters.forEach(character => {
      character.poseImageIds["side pose standing still(right facing)"] = character.poseImageIds["side pose standing still(left facing)"];
  });
}
function Create2() {
    const [userInput, setUserInput] = useState('');
    const [creating, setCreating] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [style, setStyle] = useState('real');
    
    const navigation = useNavigation(); 
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
    const storeData = async (key, value) => {
      try {
        await AsyncStorage.setItem(key, value);
        console.log(`Data stored successfully for key: ${key}`);
      } catch (error) {
        console.error(`Error storing data for key ${key}:`, error);
      }
    };

    const toggleSwitch = () => {
      setStyle((prevStyle) => (prevStyle === 'anime' ? 'real' : 'anime')); // Toggle between 'anime' and 'real'
    };
    const handleNavigate = () =>{
      //console.log("[[[[[[[[",thumbnai)
      navigation.navigate('PostTesting');
    }
    const checkdata = async () => {
      await readData('userdreamer');
    }
  const handleGenerateComicStory = async () => {
    setCreating('Creating')
    setIsDisabled(true);
    
    try {
      const schema = require('./schema2');

      const instance = axios.create({
        baseURL: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
      });
//gpt-4o-2024-08-06   gpt-4o-mini
   const panelNum = 3;
      const prompt = `You are a master comic book screenplay writer and movie director. Your task is to generate a comic-book style video screenplay 
      with well-defined panels. Each panel should mostly rely on dialogues between characters, or narration, to drive the story forward. If a character 
      receives a new outfit or transformation, reflect this in their name (e.g., "Superman_BlackSuit").
      The visual descriptions will serve as prompts for Stable Diffusion to generate images, so they should be detailed enough to describe the scene, 
      including settings, moods, and character appearances. Scenes set up in similar setting must habe similar style, to make consistant images. 
      Ensure that all scenes mentioned in the user's input are included in a cohesive, compelling way. 
      If user uses any inappropriate language, modify it while preserving the intent.The output should strictly follow the JSON schema provided and include enough 
      information to ensure that the comic-style video will have clear story flow. Do not include additional characters in the dialogue panels which you have not described in the characters array
      The storyline is: "${userInput}".`;
      
      const responsee = await instance.post('', {
        model: "gpt-4o-2024-08-06",
        //model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are the world's best comic book screenplay writer and movie director" },
          { role: "user", content: prompt },
        ],

        response_format:{
          "type": "json_schema",
          "json_schema": schema
        }
        
        })
      let generatedText = responsee.data.choices[0].message;
      
      const jsoObject = JSON.parse(generatedText.content);
      
      const readableJsonString = JSON.stringify(jsoObject, null, 2);
      //console.log(readableJsonString);
      
      let panels = jsoObject.panels;
   
      panels = await processComicBookStory(panels, style);
      const panelsConsole = JSON.stringify(panels, null, 2);
      //console.log("----------------",panelsConsole)
      characterArray = jsoObject.characters;
      
      characterArray = await generateImagesForCharacter(characterArray, style)
      const characterConsole = JSON.stringify(characterArray, null, 2);
      //console.log("+++++++++", characterConsole)
    
      const finalOutput = {
        title:jsoObject.title,
        thumbnail:panels[0].panel.genId,
        hashtag:jsoObject.hashtag,
        visualStyle:style,
        panels: panels, 
        characters: characterArray 
      };
      //setThumbnail(finalOutput.thumbnail)
      const finalJsonString = JSON.stringify(finalOutput, null, 2);

     console.log(finalJsonString);
     await storeData("story1", finalJsonString);

      setCreating('Your imagination is reality now');
      setIsDisabled(false);
      return;
    
    } 
    catch (error) {
      console.error('Error::::::::', error.response?.data || error.message);
      setCreating('There has been some error. Please try again')
      setIsDisabled(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Create Your Story</Text>
        
        <TextInput
            style={styles.input}
            placeholder="Enter your story here"
            value={userInput}
            onChangeText={setUserInput}
            multiline
        />
        
        <View style={styles.switchContainer}>
            <Text style={styles.label}>Selected Style: {style}</Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={style === 'real' ? '#f5dd4b' : '#f4f3f4'}
                value={style === 'real'}
                onValueChange={toggleSwitch}
            />
        </View>

        <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={handleGenerateComicStory}
            disabled={isDisabled}
        >
            <Text style={styles.buttonText}>Generate video</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleNavigate}>
            <Text style={styles.secondaryButtonText}>Play the video</Text>
        </TouchableOpacity>

        {creating ? <Text style={styles.statusText}>{creating}</Text> : null}
    </ScrollView>
</SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
  alignItems: 'center',
  paddingVertical: 20,
  paddingHorizontal: 16,
  },
  headerText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 20,
  },
  input: {
  width: '100%',
  minHeight: 80,
  borderWidth: 1,
  borderColor: '#C4C4C4',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 8,
  fontSize: 16,
  backgroundColor: '#FFF',
  marginBottom: 16,
  textAlignVertical: 'top', // For Android multiline text
  },
  switchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  width: '100%',
  justifyContent: 'space-between',
  paddingHorizontal: 10,
  },
  label: {
  fontSize: 16,
  color: '#555',
  },
  button: {
  backgroundColor: '#9c846d',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  width: '100%',
  alignItems: 'center',
  marginBottom: 10,
  },
  buttonDisabled: {
  backgroundColor: '#A5D6A7',
  },
  buttonText: {
  fontSize: 18,
  color: '#FFF',
  fontWeight: 'bold',
  },
  secondaryButton: {
  backgroundColor: '#FFF',
  borderColor: '#9c846d',
  borderWidth: 1,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  width: '100%',
  alignItems: 'center',
  marginBottom: 16,
  },
  secondaryButtonText: {
  fontSize: 18,
  color: '#9c846d',
  fontWeight: 'bold',
  },
  statusText: {
  fontSize: 16,
  color: '#555',
  marginTop: 10,
  textAlign: 'center',
  },
});

export default Create2;
