import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, Image, Switch } from 'react-native';
import axios from 'axios';
import { OPENAI_KEY, LEONARDO_API } from '@env';
import VideoPlayer from './VideoPlayer';
import { uploadData, getUrl } from 'aws-amplify/storage';
import {combine, generateImagesForCharacter, processComicBookStory, verifyImageUrls} from './CreateHelper2';
import { processDialogues } from './Dialogue';
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

    const toggleSwitch = () => {
      setStyle((prevStyle) => (prevStyle === 'anime' ? 'real' : 'anime')); // Toggle between 'anime' and 'real'
    };

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
      information to ensure that the comic-style video will have clear story flow. 
      The storyline is: "${userInput}".`;
      
      const responsee = await instance.post('', {
        model: "gpt-4o-2024-08-06",
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
      //console.log(generatedText)

      // Now parse the inner content, which is another JSON string
      const jsoObject = JSON.parse(generatedText.content);
      

      const readableJsonString = JSON.stringify(jsoObject, null, 2);
      console.log(readableJsonString);
      setCreating('Your imagination is reality now');
      setIsDisabled(false);
      return;

      let panels = jsoObject.panels;
      let characters =jsoObject.characters;
      panels = await processComicBookStory(panels, style);
      characterArray = jsoObject.characters;
      panels = await processDialogues(panels, characters)

      characterArray = await generateImagesForCharacter(characterArray, style)
    
      addRightFacingPose(characterArray);

      //const readableJsonString2 = JSON.stringify(jsoObject2, null, 2);
      // console.log(readableJsonString2);
      // console.log(JSON.stringify(panels, null, 2));
      // console.log(JSON.stringify(characterArray, null, 2));
      count = count + responsee.data.usage.total_tokens;
      console.log("total tokens consumed == ",count);
      console.log("model used ", responsee.data.model);
      const finalOutput = {
        title:jsoObject.title,
        hashtag:jsoObject.hashtag,
        visualStyle:jsoObject.style,
        panels: panels, 
        characters: characterArray 
      };
      const t = JSON.stringify(finalOutput)
      // try {
      //   const result = await uploadData({
      //     key: "story1",
      //     data: t,
      //   }).result; 
      //   console.log('Succeeded: ', result);
      // } catch (error) {
      //   console.log('Error : ', error);
      // }
      const finalJsonString = JSON.stringify(finalOutput, null, 2);

      //Log the combined JSON string
      console.log(finalJsonString);
      //let script = await processComicBookStory(JSON.parse(generatedText));
      await verifyImageUrls(finalOutput)
        .then(validImageUrls => {
            console.log('Valid image URLs:', validImageUrls);
        // Now you can pass these valid image URLs to the <Image> tag or any other component
          })
          .catch(error => console.error('Error verifying image URLs:::::::', error));


        //console.log(JSON.stringify(script));
      setCreating('Your imagination is reality now')
      setIsDisabled(false);
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
        
        <TextInput
          style={styles.input}
          placeholder="Enter your prompt her"
          value={userInput}
          onChangeText={setUserInput}
        />
        <Text>Selected Style: {style}</Text>
      <Switch
        value={style === 'real'} // Switch is ON if style is 'real'
        onValueChange={toggleSwitch} // Toggle between 'anime' and 'real'
      />
        <Button title="Generate Response" onPress={handleGenerateComicStory} disabled={isDisabled} />
        <Button title="check data" onPress={checkdata}  />
        <Text>{creating}</Text>
        {/* <VideoPlayer data={generatedText11} /> */}
      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  response: {
    fontSize: 16,
    marginTop: 16,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Create2;
