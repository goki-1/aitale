import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { OPENAI_KEY, LEONARDO_API } from '@env';
import VideoPlayer from './VideoPlayer';
import { uploadData, getUrl } from 'aws-amplify/storage';
import {combine, generateImagesForCharacter, processComicBookStory, verifyImageUrls} from './CreateHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const generateCustomSchema = require('./schemaC');
function addRightFacingPose(characters) {
  characters.forEach(character => {
      character.poseImageIds["side pose standing still(right facing)"] = character.poseImageIds["side pose standing still(left facing)"];
  });
}
function Create() {
    const [userInput, setUserInput] = useState('');
    const [creating, setCreating] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

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

    const checkdata = async () => {
      await readData('userdreamer');
    }
  const handleGenerateComicStory = async () => {
    setCreating('Creating')
    setIsDisabled(true);
    
    try {
      const schema = require('./schema');

      const instance = axios.create({
        baseURL: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
      });

   const panelNum = 3;
      const prompt = `Return output in form of JSON of "${panelNum}" panels for making a Comic-book style video. Story mostly discribed by characters' dialogues or it could 
      be background narrator. Make sure to fill the story gaps and include all the scenes mentioned by user and write a cohesive, good story from user's storyline. If user has used
      inappropriate language you can give it little modification. Follow all the schema instructions. Storyline from user is -- "${userInput}"`;
      const responsee = await instance.post('', {
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        messages: [
          { role: "system", content: "You are a detailed comic book storyteller and movie director." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            "function": {
              "name": "ComicStory",
              "description": "return the detailed comic story by following schema",
              "parameters": schema
            }
          }
          ],
          tool_choice: {"type": "function", "function": {"name": "ComicStory"}}
        })
      let generatedText = responsee.data.choices[0].message.tool_calls[0].function.arguments;
      let count = responsee.data.usage.total_tokens;
      
      const jsoObject = JSON.parse(generatedText);

      const readableJsonString = JSON.stringify(jsoObject, null, 2);
      console.log(readableJsonString);

      let panels = jsoObject.panels;
      panels = await processComicBookStory(panels);
      characterArray = jsoObject.characters;
      
      const schema2 = generateCustomSchema(characterArray);
      
      const prompt2 = `Return output in form of JSON for designing costume or descring visual appearance of all given characters in describeCharaters function. Storyline and characters from user are -- "${userInput}"`;
      const responsee2 = await instance.post('', {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "I am a detailed costume designer and movie director." },
          { role: "user", content: prompt2 }
        ],
        tools: [
          {
            type: "function",
            "function": {
              "name": "CostumeDesign",
              "description": "return the Costume of characters",
              "parameters": schema2
            }
          }
          ],
          tool_choice: {"type": "function", "function": {"name": "CostumeDesign"}}
        })

      let generatedText2 = responsee2.data.choices[0].message.tool_calls[0].function.arguments;
      
      const jsoObject2 = JSON.parse(generatedText2);
      
      characterArray = combine(characterArray, jsoObject2)
      characterArray = await generateImagesForCharacter(characterArray)
    
      addRightFacingPose(characterArray);

      //const readableJsonString2 = JSON.stringify(jsoObject2, null, 2);
      // console.log(readableJsonString2);
      // console.log(JSON.stringify(panels, null, 2));
      // console.log(JSON.stringify(characterArray, null, 2));
      count = count + responsee2.data.usage.total_tokens;
      console.log("total tokens consumed == ",count);
      console.log("model used ", responsee2.data.model);
      const finalOutput = {
        title:jsoObject.title,
        hashtag:jsoObject.hashtag,
        visualStyle:jsoObject.visualStyle,
        panels: panels, // This is from the comic story generation
        characters: characterArray // This is from the character design generation
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

export default Create;
