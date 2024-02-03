/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, Image } from 'react-native';
import Tts from 'react-native-tts';
import axios from 'axios';
import { OPENAI_KEY, LEONARDO_API, GOOGLE_APPLICATION_CREDENTIALS } from '@env';
import VideoPlayer from './VideoPlayer';

function Create() {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState(null);
    const [generationId, setGenerationId] = useState(null);
    const [textToSpeak, setTextToSpeak] = useState('');
    

    const AlbedoBaseXL = "2067ae52-33fd-4a82-bb92-c2c55e7d2786";
    const LeonardoDiffusionXL = "1e60896f-3c26-4296-8ecc-53e2afecc132";
    const LeonardoVisionXL = "5c232a9e-9061-4777-980a-ddc8e65647c6";
    const DreamShaper = "ac614f96-1082-45bf-be9d-757f2d31c174";

    const apiKey = LEONARDO_API;
    const userId = "ad1fa781-4f92-4642-a3d3-a5bf85eec6e3";
    let generatedText = {
      "title": "Ironman and Spiderman vs Venom",
      "panels": [
        {
          "type": "character dialogues",
          "content": [
            {
              "character": "Ironman",
              "dialogue": "Spiderman, we need to take Venom down!",
              "tone": "serious",
              "pose": "front pose standing still",
              "character_relative_location_in_panel": "left",
              "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/ea72e979-509e-4aa9-a83f-fd7f9a19fe53/variations/Default_Robert_Downey_Jr_as_Ironman_in_the_iconic_red_and_gold_0_ea72e979-509e-4aa9-a83f-fd7f9a19fe53_0.png"
            },
            {
              "character": "Spiderman",
              "dialogue": "I'm ready! Let's do this!",
              "tone": "determined",
              "pose": "front pose standing still",
              "character_relative_location_in_panel": "right",
              "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/e178460a-2236-4376-ae9a-1b9195dbc60f/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_e178460a-2236-4376-ae9a-1b9195dbc60f_0.png"
            }
          ],
          "description_of_background": "the city streets, with towering skyscrapers in the background.",
          "camera_movement": "zoom in",
          "background_music": "ambient",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/05072638-04e2-42dc-adeb-74244705d9be/Leonardo_Diffusion_XL_busy_city_night_time_0.jpg"
        },
        {
          "type": "scene with no characters",
          "content": [],
          "description_of_background": "busy city, night time.",
          "camera_movement": "right to left",
          "background_music": "police siren",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b0b28199-be76-41c9-b87a-b0f7a30a9e03/Leonardo_Diffusion_XL_the_city_streets_with_towering_skyscrape_0.jpg"
        },
        {
          "type": "narrator",
          "content": [
            {
              "character": "narrator",
              "dialogue": "To save the city Spiderman and ironman has to take down Venom together",
              "tone": "serious",
              "pose": "",
              "character_relative_location_in_panel": "",
              "gen_id":""
            },
          ],
          "description_of_background": "busy city, night time.",
          "camera_movement": "right to left",
          "background_music": "police siren",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b0b28199-be76-41c9-b87a-b0f7a30a9e03/Leonardo_Diffusion_XL_the_city_streets_with_towering_skyscrape_0.jpg"
        },
        {
          "type": "character dialogues",
          "content": [
            {
              "character": "Venom",
              "dialogue": "You can't stop me! I am the ultimate predator!",
              "tone": "menacing",
              "pose": "side pose standing still(right facing)",
              "character_relative_location_in_panel": "center",
              "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/edde5f6e-63f8-484e-bb2b-94088c292f6d/variations/Default_Venom_a_formidable_and_monstrous_being_with_dark_symbi_0_edde5f6e-63f8-484e-bb2b-94088c292f6d_0.png"
            },
            {
              "character": "Spiderman",
              "dialogue": "With great powers come great responsibilities",
              "tone": "determined",
              "pose": "side pose standing still(left facing)",
              "character_relative_location_in_panel": "right",
              "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/a3d47ef4-d76d-4513-a5e1-426895e1eac8/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_a3d47ef4-d76d-4513-a5e1-426895e1eac8_0.png"
            },
            {
              "character": "Ironman",
              "dialogue": "And, I, am, Ironman! And, I, am, Ironman! ",
              "tone": "serious",
              "pose": "side pose standing still(left facing)",
              "character_relative_location_in_panel": "right",
              "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/0c60357e-a959-411a-8b39-d3d33e9137a5/variations/Default_back_pose_Robert_Downey_Jr_as_Ironman_in_the_iconic_re_0_0c60357e-a959-411a-8b39-d3d33e9137a5_0.png"
            },
          ],
          "description_of_background": "City, roads, cars, ground level",
          "camera_movement": "zoom out",
          "background_music": "no music",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b46ce78d-3b5a-465b-83f5-6eee9c899cd5/Leonardo_Diffusion_XL_City_roads_cars_ground_level_0.jpg"
        }
      ],
      "characters": [
        {
          "character": "Ironman",
          "sound": "male",
          "visual_description": "Robert Downey Jr. as Ironman, in the iconic red and gold armored suit, with glowing arc reactor in the chest and a helmet with a face plate."
        },
        {
          "character": "Spiderman",
          "sound": "male",
          "visual_description": "Tom Holland as Spiderman, in the classic red and blue web-slinger suit, with the iconic spider emblem on the chest and expressive eye lenses."
        },
        {
          "character": "Venom",
          "sound": "deep sound",
          "visual_description": "Venom, a formidable and monstrous being, with dark symbiote tendrils, glowing eyes, and a menacing, toothy grin."
        }
      ]
    }
    

    const handleSpeak = async () => {

    };

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

    // const generateImagesForCharacte = async () => {
    
    //   try {
    //     //const apiUrlnobg = 'https://cloud.leonardo.ai/api/rest/v1/variations/nobg';
    //     const apiUrl = 'https://cloud.leonardo.ai/api/rest/v1/generations';
    //     const token = LEONARDO_API;
    //     const requestData = {
    //       prompt: "Robert Downey Jr. as Ironman, in the iconic red and gold armored suit, with glowing arc reactor in the chest and a helmet with a face plate.",
    //       negative_prompt: "multiple faces, characters, deformed limbs, deformed fingers, deformed body",
    //       modelId: DreamShaper,
    //       width: 1024,
    //       height: 768,
    //       //promptMagic: true,
    //       public: false,
    //       presetStyle: 'LEONARDO',
    //       num_images:1,
    //       //num_inference_steps: 30,
    //       //init_generation_image_id: "766ee8dd-b188-4801-9110-825a67ae0ff8",
    //       init_strength: 0.7,
    //       //controlNet: true,
    //       //controlNetType: "POSE",
          
    //     };
    //     const headers = {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     };
    //     const responsee = await axios.post(apiUrl, requestData, { headers });
    //     generatedId = responsee.data.sdGenerationJob.generationId;
    //     console.log("character photot id  ", generatedId);
    //     return generatedId;
        
    //   } catch (error) {
    //     console.error('Error charac:', error.response.data ?? error.message);
    //   }
      
    // };
    
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
          // controlNet: true,
          // controlNetType: "POSE",
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
    if (userInput.trim() === '') {
      // Check if the user input is empty
      console.log("User input is empty.");
      return;
    }
  try {

  // Define the JSON Schema for the comic story
  const schema = require('./schema');
    console.log(userInput);

  // Create a chat completion using OpenAI GPT-3
  // const instance = axios.create({
  //   baseURL: 'https://api.openai.com/v1/chat/completions',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${OPENAI_KEY}`,
  //   },
  // });
  // const prompt = `Return info in form of JSON for making a Comic book-style video. Make sure to follow the instructions while describing the character's visual description, include the name of the 
  // character/actor playing it or if character not famous include random suitable name. Story mostly discribed by characters' dialogues or it could be background narrator. Storyline from user is -- ${userInput}`;
  // const responsee = await instance.post('', {
  //   model: "gpt-3.5-turbo-1106",
  //   messages: [
  //     { role: "system", content: "You are a detailed comic book storyteller and movie director." },
  //     { role: "user", content: prompt },
  //   ],
  //   functions: [{ name: "setComicStory", parameters: schema }],
  //   function_call: { name: "setComicStory" },
  // });
  // let generatedText = responsee.data.choices[0].message.function_call.arguments;

  
  console.log(JSON.stringify(generatedText));
  let script = await processComicBookStory(JSON.parse(generatedText));
  // setTimeout(() => {

    console.log(JSON.stringify(script));
  // }, 9000);
  //setResponse(generatedText);
  //playMovie(script);
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
        <Button title="Generate Response" onPress={handleGenerateComicStory} />
        
        <VideoPlayer data={generatedText} />
        {/* <Text style={styles.response}>{response}</Text> */}

<TextInput
        style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Enter text to speak"
        onChangeText={setTextToSpeak}
      />
      <Button title="Speak" onPress={handleSpeak} />
      
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
