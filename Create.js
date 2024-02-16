import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { OPENAI_KEY, LEONARDO_API } from '@env';
import VideoPlayer from './VideoPlayer';

function Create() {
    const [userInput, setUserInput] = useState('');
    const [creating, setCreating] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    const AlbedoBaseXL = "2067ae52-33fd-4a82-bb92-c2c55e7d2786";
    const LeonardoDiffusionXL = "1e60896f-3c26-4296-8ecc-53e2afecc132";
    const LeonardoVisionXL = "5c232a9e-9061-4777-980a-ddc8e65647c6";
    const DreamShaper = "ac614f96-1082-45bf-be9d-757f2d31c174";

    const apiKey = LEONARDO_API;
    const userId = "ad1fa781-4f92-4642-a3d3-a5bf85eec6e3";
    
    const idofPose = (pose) => {
      const list = {
      "front pose standing still": "766ee8dd-b188-4801-9110-825a67ae0ff8",
      "side pose standing still(left facing)":"daad58fe-a22f-4359-8062-2731f9f37c3a", 
      "standing back pose":"de7968c9-737c-4fb6-974e-3dd0b83e6a46", 
      // "standing and waving hand":"", 
      // "showing anger, hands quenched, and back little bent":"5",
      // "heroic landing on ground form air":"", 
      // "standing, front facing, arms wide open":"",
      // "puching front pose":"5", 
      // "punching side pose(left facing)":"", 
      }
      
      const matchingPose = Object.keys(list).find(key => key === pose);

      return matchingPose ? list[matchingPose] : null;
    }
    const generateImagesForCharacter = async (characterr, listOfCharacters, pose) => {
      //console.log(listOfCharacters);
      const charac = listOfCharacters.find(
        (char) => char.character === characterr
      );
      let generatedId;
      console.log("logging the character disc  ", charac);
      const genId =  idofPose(pose);
      let promptt = charac.visual_description + "";
    
      try {
        //const apiUrlnobg = 'https://cloud.leonardo.ai/api/rest/v1/variations/nobg';
        const apiUrl = 'https://cloud.leonardo.ai/api/rest/v1/generations';
        const token = LEONARDO_API;
        const requestData = {
          prompt: promptt,
          negative_prompt: "multiple faces, characters, deformed limbs, deformed fingers, deformed body",
          modelId: DreamShaper,
          width: 1024,
          height: 768,
          //promptMagic: true,
          public: false,
          presetStyle: 'LEONARDO',
          num_images:1,
          num_inference_steps: 30,
          init_generation_image_id: genId,
          init_strength: 0.7,
          controlNet: true,
          controlNetType: "POSE",
          
        };
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const responsee = await axios.post(apiUrl, requestData, { headers });
        generatedId = responsee.data.sdGenerationJob.generationId;
        console.log("character photot id  ", generatedId);
        return generatedId;
        // if (background === null) {
        //   const requestDatabg = {
        //     id: generatedId,
        //     isVariation: true
        //   };
        //   axios.post(apiUrlnobg, requestDatabg, {headers})
        //     .then(response => {
        //       generatedId = response.data.sdNobgJob.id;
              
        //     })
        //     .catch(error => {
        //       console.error('Error not there:', error);
        //     });
        // }
        
      } catch (error) {
        console.error('Error charac:', error.response.data ?? error.message);
      }
      
    };
    
    const generateImageOfBackground = async (sceneDescription) => {
      try {
        const apiUrl = 'https://cloud.leonardo.ai/api/rest/v1/generations';
        const token = LEONARDO_API;
        const requestData = {
          prompt: sceneDescription,
          negative_prompt: "multiple faces, deformed limbs, deformed fingers, deformed body, poor quality",
          modelId: DreamShaper,
          width: 1360,
          height: 768,
          promptMagic: true,
          public: false,
          presetStyle: 'LEONARDO',
          num_images:1,
          num_inference_steps: 30,
        };
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const responsee = await axios.post(apiUrl, requestData, { headers });
        const generatedId = responsee.data.sdGenerationJob.generationId;
        
        console.log("background photo  ",generatedId);
        return generatedId;
      } catch (error) {
        console.error('Error back::', error.response.data ?? error.message);
      }
      
    };


    const generateImagesForPanel = async (panel, characters) => {
      try {
        if (panel.type === "character dialogues") {
          for (const dialogue of panel.content) {
            dialogue.tone = await generateImagesForCharacter(dialogue.character, characters, dialogue.pose);
            //await new Promise(resolve => setTimeout(resolve, 20000));
          }
          panel.background_music = await generateImageOfBackground(panel.description_of_background);
        } else if (panel.type === "scene with no characters" || panel.type === "narrator") {
          panel.background_music = await generateImageOfBackground(panel.description_of_background);
        }
    
        //await new Promise(resolve => setTimeout(resolve, 20000));
    
        return panel;
      } catch (error) {
        console.error('Error generating images for panel:', error.message);
        return null;
      }
    };
    
    const processComicBookStory = async (comicBookStory) => {
      comicBookStory.panels = await Promise.all(comicBookStory.panels.map(async (panel) => {
        //console.log(panel);
        return await generateImagesForPanel(panel, comicBookStory.characters);
      }));
      return comicBookStory;
    };
    
    
  const handleGenerateComicStory = async () => {
    setCreating('Creating')
    setIsDisabled(true);
    if (userInput.trim() === '') {
      // Check if the user input is empty
      console.log("User input is empty.");
      return;
    }
    try {
      const schema = require('./schema');
      const schemaReply = { 
        type: "object",
        properties: {
          reply: {
          type: "string",
          enum: ["yes", "no"],
          description: "reply yes if it user input has sexual content otherwise reply no",
          },
        }
        }

      const instance = axios.create({
        baseURL: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
      });
      const guidelineCheckPrompt = `Review the following user input for creating a comic book story. check if it has sexual content? --"${userInput}"`;
    const guidelineCheckResponse = await instance.post('', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "I am a detailed content guideline checker." },
        { role: "user", content: guidelineCheckPrompt },
      ],
      functions: [{ name: "reply", parameters: schemaReply }],
      function_call: { name: "reply" },
    });

    const guidelineCheckResult = guidelineCheckResponse.data.choices[0].message.function_call.arguments;
    console.log("replying yes or no ---- ",guidelineCheckResult);
    const jsonObject = JSON.parse(guidelineCheckResult);
  if (jsonObject.reply && jsonObject.reply.toLowerCase() === 'yes') {
      setCreating('Please stick to community guidlines...');
      setIsDisabled(false);
      console.log("did not pass");
      return;
    }
    console.log("passes the check ");
    setCreating('Your movie is done')
    setIsDisabled(false);
   
      const prompt = `Return output in form of JSON for making a Comic book-style video. Make sure to follow the instructions while describing the character's visual description, include the name of the 
      character/actor playing it or if character not famous include random suitable name. Story mostly discribed by characters' dialogues or it could be background narrator. Storyline from user is -- ${userInput}`;
      const responsee = await instance.post('', {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a detailed comic book storyteller and movie director." },
          { role: "user", content: prompt },
        ],
        functions: [{ name: "setComicStory", parameters: schema }],
        function_call: { name: "setComicStory" },
      });
      let generatedText = responsee.data.choices[0].message.function_call.arguments;

      
      console.log((generatedText));
      //let script = await processComicBookStory(JSON.parse(generatedText));


        //console.log(JSON.stringify(script));
      setCreating('Your movie is done')
      setIsDisabled(false);
    } 
    catch (error) {
      console.error('Error::::::::', error.response?.data || error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Chat with GPT-3</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your prompt her"
          value={userInput}
          onChangeText={setUserInput}
        />
        <Button title="Generate Response" onPress={handleGenerateComicStory} disabled={isDisabled} />
        <Text>{creating}</Text>
        {/* <VideoPlayer data={generatedText} /> */}
      
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
