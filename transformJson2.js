  import React, { useState } from 'react';
  import { View, Button, Text } from 'react-native';
  import axios from 'axios';
  import RNFS from 'react-native-fs';
  import Sound from 'react-native-sound';
  import { Buffer } from "buffer";
  import { OPENAI_KEY } from '@env';

  async function texttoaudioPath(text, voice, i) {
    const requestData = {
      "model": "tts-1",
      "input": text,
      "voice": voice
    };
  console.log(text)
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/speech', requestData, {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      });
      
      const audioBuffer = Buffer.from(response.data);

      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let result = '';
      const charactersLength = characters.length;
      
      for (let i = 0; i < 20; i++) 
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

      const path = `${RNFS.DocumentDirectoryPath}/spee${result}.mp3`;
  
      await RNFS.writeFile(path, audioBuffer.toString('base64'), 'base64');
      console.log('Audio content written to file:', path);
      return path;
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  }
  
  const calculateDuration = (audioPath) => {
    return new Promise((resolve, reject) => {
      const sound = new Sound(audioPath, '', (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          reject(error);
          return;
        }
        resolve(sound.getDuration());
      });
    });
  };
  
  async function generateDialogueAudio(panel, characters) {
    const maleVoices = ["echo", "onyx"];
    const femaleVoices = ["alloy", "fable", "nova", "shimmer"];
    let j = 0, jj = 0;
  
    characters.forEach(index => {
      if (index.sound === "male" || index.sound === "deep sound") {
        index.soundName = maleVoices[j++];
      } else if (index.sound === "female") {
        index.soundName = femaleVoices[jj++];
      }
      if (j === 2) j = 0;
      if (jj === 4) jj = 0;
    });
  
    let i = 0;
    for (const index of panel.content) {
      const voice = characters.find(indexx => indexx.character === index.character)?.soundName;
      if (voice && panel.content.length === 1) {
        index.dialoguePathUrl = await texttoaudioPath(index.dialogue, voice, i++);
        index.dialogueDuration = await calculateDuration(index.dialoguePathUrl);
      }
    }
    return panel;
  }
  
  const transformDialoguePanel = async (panel, characters) => {
    panel = await generateDialogueAudio(panel, characters);
   
    if (panel.content.length > 1){
        panel.duration = 2000;
        //console.log(";;;;;;;;;;")
    }
    if(panel.content.length === 1){
        panel.duration = panel.content[0].dialogueDuration * 1500;
        characters.forEach(character => {
          if (character.character === panel.content[0].character) {
            panel.content[0].characId0 = character.poseImageIds["front pose standing still"];
          }
        });
    }
    return panel;
  };
  
  const transformFocusPanel = (panel, characters) => {
    characters.forEach(character => {
      if (character.character === panel.character) {
        panel.characId0 = character.poseImageIds["front pose standing still"];
      }
    });
    if (panel.reason_for_focusing == "normal entry") {
      panel.motionShot = ["knee to face", "face entry"];
    }
    else if (panel.reason_for_focusing == "powerful/super entry" || panel.reason_for_focusing == "getting transformed") {
      panel.motionShot = ["knee to face", "face entry", "waist and up entry", "arms entry", "side up entry"];
    }
    return panel;
  };
  
  const transformFightPanel = (panel, characters) => {
    panel.duration = 2000;
        characters.forEach(character => {
          if (character.character === panel.sequence_of_actions[0].character) {
            panel.sequence_of_actions[0].characId0 = character.poseImageIds[panel.sequence_of_actions[0].action];
          }
        });
    return panel;
  };
  
  const callFunctionOnPanelType = async (panel, characters) => {
    
    if (panel.panel.content != null) {
      panel.panel =  await transformDialoguePanel(panel.panel, characters);
      panel.panel.characId0 = null;
    } else if (panel.panel.description_of_the_shot != null) {
      panel.panel.duration = 5000;
      panel.panel.characId0 = null;
      //console.log("panel.panel")
    } else if (panel.panel.reason_for_focusing != null) {
      panel.panel.duration = 6000
      panel.panel = transformFocusPanel(panel.panel, characters);

    } else if (panel.panel.sequence_of_actions != null) {
      panel.panel = transformFightPanel(panel.panel, characters);
    }
    //console.log(panel)
    return panel;
  };
  
  const transformJson = async (story) => {
  let panels = story.panels;
  let characters = story.characters;
  let transformedPanels = [];
  let panelCounter = 1;

  for (let i = 0; i < panels.length; i++) {
    let panel = panels[i];

    if (panel.panel.content && panel.panel.content.length > 1) {
      // If panel has multiple content items, split them into individual panels
      transformedPanels.push(await callFunctionOnPanelType(panel, characters));

      for (const [index, contentItem] of panel.panel.content.entries()) {
        let newPanel = JSON.parse(JSON.stringify(panel)); // Deep clone panel
        newPanel.panel_number = panelCounter++;
        newPanel.panel.content = [contentItem]; // Set only one content item
        transformedPanels.push(await callFunctionOnPanelType(newPanel, characters));
      }
    } 
    else if (panel.panel.sequence_of_actions) {

      for (const [index, contentItem] of panel.panel.sequence_of_actions.entries()) {
        let newPanel = JSON.parse(JSON.stringify(panel)); // Deep clone panel
        newPanel.panel_number = panelCounter++;
        newPanel.panel.sequence_of_actions = [contentItem]; 
        transformedPanels.push(await callFunctionOnPanelType(newPanel, characters));
      }
    }
    else {
      // If panel has one content item or it's not a content-based panel
      panel.panel_number = panelCounter++; 
      transformedPanels.push(await callFunctionOnPanelType(panel, characters));
    }
  }
  for (let i = 0; i < transformedPanels.length; i++) {
    let panel = transformedPanels[i];
    if (panel.panel.content != null && panel.panel.content.length === 2) {
        characters.forEach(character => {
            if (character.character === panel.panel.content[0].character) {
                panel.panel.content[0].characId0 = character.poseImageIds["side pose standing still(right facing)"];
            }
        }); 
        characters.forEach(character => {
            if (character.character === panel.panel.content[1].character) {
                panel.panel.content[1].characId0 = character.poseImageIds["side pose standing still(left facing)"];
            }
        });  
    }
    if (panel.panel.content != null && panel.panel.content.length === 3) {
        characters.forEach(character => {
            if (character.character === panel.panel.content[0].character) {
                panel.panel.content[0].characId0 = character.poseImageIds["side pose standing still(right facing)"];
            }
        }); 
        characters.forEach(character => {
            if (character.character === panel.panel.content[2].character) {
                panel.panel.content[2].characId0 = character.poseImageIds["side pose standing still(left facing)"];
            }
        });  
    }

    }  
  return transformedPanels;
};
  
export default transformJson;
  