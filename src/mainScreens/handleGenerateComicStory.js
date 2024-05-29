import axios from 'axios';
import { OPENAI_KEY, } from '@env';

import {combine, generateImagesForCharacter, processComicBookStory, verifyImageUrls} from '../../CreateHelper';

const generateCustomSchema = require('../../schemaC');
function addRightFacingPose(characters) {
  characters.forEach(character => {
      character.poseImageIds["side pose standing still(right facing)"] = character.poseImageIds["side pose standing still(left facing)"];
  });
}

  const handleGenerateComicStory = async (userInput) => {
    
    try {
      const schema = require('../../schema');

      const instance = axios.create({
        baseURL: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
      });

   const panelNum = 5;
      const prompt = `Return detailed, consistent, creative data in form of JSON of panels for making a Comic-book style video. Story mostly discribed by characters' dialogues or it could 
      be background narrator. Make sure to fill the story gaps and include all the scenes mentioned by user and write a cohesive, good screenplay from user's storyline. If user has used
      inappropriate language you can make little modification. If the character's appearance changes give it another name. Follow all the schema instructions. Storyline from user is -- "${userInput}"`;
      const responsee = await instance.post('', {
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        messages: [
          { role: "system", content: "You are the world's best movie director and comic-book story teller" },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            "function": {
              "name": "ComicStory",
              "description": "return the detailed and best Screenplay by following schema",
              "parameters": schema
            }
          }
          ],
          tool_choice: {"type": "function", "function": {"name": "ComicStory"}}
        })
      let generatedText = responsee.data.choices[0].message.tool_calls[0].function.arguments;
      let count = responsee.data.usage.total_tokens;
      
      const jsoObject = JSON.parse(generatedText);

      //const readableJsonString = JSON.stringify(jsoObject, null, 2);
      
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

      const finalOutput = {
        title:jsoObject.title,
        hashtag:jsoObject.hashtag,
        visualStyle:jsoObject.visualStyle,
        panels: panels, // This is from the comic story generation
        characters: characterArray // This is from the character design generation
      };

      await verifyImageUrls(finalOutput)
        .then(validImageUrls => {
            console.log('Valid image URLs:', validImageUrls);
        // Now you can pass these valid image URLs to the <Image> tag or any other component
          })
          .catch(error => console.error('Error verifying image URLs:::::::', error));

      return finalOutput;
      
    } 
    catch (error) {
      console.error('Error::::::::', error.response?.data || error.message);
    }
  };
  
        
  export {handleGenerateComicStory};
