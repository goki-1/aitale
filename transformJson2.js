  import React, { useState } from 'react';
  import { View, Button, Text } from 'react-native';
  import axios from 'axios';
  import RNFS from 'react-native-fs';
  import Sound from 'react-native-sound';
  import { Buffer } from "buffer";
  
  async function texttoaudioPath(text, voice, i) {
    const requestData = {
      "model": "tts-1",
      "input": text,
      "voice": voice
    };
  
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/speech', requestData, {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      });
  
      const audioBuffer = Buffer.from(response.data);
      const path = `${RNFS.DocumentDirectoryPath}/speech${i}.mp3`;
  
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
    const maleVoices = ["Echo", "Onyx"];
    const femaleVoices = ["Alloy", "Fable", "Nova", "Shimmer"];
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
      if (voice) {
        index.pathUrl = await texttoaudioPath(index.dialogue, voice, i++);
        index.duration = await calculateDuration(index.pathUrl);
      }
    }
    return panel;
  }
  
  const transformDialoguePanel = async (panel, characters) => {
    if (panel.content.length == 1) {
      if (panel.content[0].action_being_performed_or_state_of_character == 'flying') {
        panel.content[0].shot = ["waist and up", "body and more", "face", "side"];
      } else {
        panel.content[0].shot = ["waist and up", "full body", "face", "side"];
      }
    }
    if (panel.total_characters_in_this_scene == 2) {
      if (panel.content[0].positioning_of_character == "positioned opposite to one another")
        panel.content[0].shot = ["waist and up", "face", "back and front", "side"];
  
      if (panel.content[0].positioning_of_character == "positioned together")
        panel.content[0].shot = ["waist and up", "face", "along side from front", "along side from side"];
    }
    if (panel.total_characters_in_this_scene >= 3) {
      panel.content.forEach(character => {
        if (character.positioning_of_character == "positioned apart or far away") {
          character.shot = ["waist and up", "full body", "face"];
        } else {
          character.shot = ["waist and up", "face", "along side from front", "along side from side"];
        }
      });
    }
    panel = await generateDialogueAudio(panel, characters);
    return panel;
  };
  
  const transformFocusPanel = (panel) => {
    if (panel.reason_for_focusing == "normal entry") {
      panel.motionShot = ["knee to face", "face entry"];
    }
    if (panel.reason_for_focusing == "powerful/super entry" || panel.reason_for_focusing == "getting transformed") {
      panel.motionShot = ["knee to face", "face entry", "waist and up entry", "arms entry", "side up entry"];
    }
    return panel;
  };
  
  const transformFightPanel = (panel) => {
    return panel;
  };
  
  const callFunctionOnPanelType = async (panel, characters) => {
    if (panel.content != null) {
      panel = await transformDialoguePanel(panel, characters);
    } else if (panel.description_of_the_shot != null) {
      panel.type = 'complete';
    } else if (panel.reason_for_focusing != null) {
      panel = transformFocusPanel(panel, characters);
    } else if (panel.sequence_of_actions != null) {
      panel = transformFightPanel(panel, characters);
    }
    return panel;
  };
  
  const transformJson = async (story) => {
    let panels = story.panels;
    let characters = story.characters;
    let transformedPanels = [];
  
    for (let i = 0; i < panels.length; i++) {
      transformedPanels[i] = await callFunctionOnPanelType(panels[i], characters);
    }
  console.log("////",transformedPanels);
    return transformedPanels;
  };
  
  export default transformJson;
  