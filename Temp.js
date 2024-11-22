import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import {Buffer} from "buffer";

import { OPENAI_KEY } from '@env'; // Replace with your OpenAI API key

const Temp = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  const generateAudio = async () => {
    const requestData = {
      "model": "tts-1",
      "input": "Today",
      "voice": "alloy"
    };

    try {
      // Perform the Text-to-Speech request using axios
      const response = await axios.post('https://api.openai.com/v1/audio/speech', requestData, {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // Important for receiving binary data
      });

      const audioBuffer = Buffer.from(response.data);

      // Convert ArrayBuffer to Uint8Array
      //const audioData = new Uint8Array(response.data);
      const path = `${RNFS.DocumentDirectoryPath}/speech.mp3`;

      // Write the Uint8Array to file
      await RNFS.writeFile(path, audioBuffer.toString('base64'), 'base64'); // 'ascii' allows binary data to be written correctly
      console.log('Audio content written to file:', path);
      calculateDuration(path);
      setAudioUrl(path);
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  const calculateDuration = (audioPath) => {
    const sound = new Sound(audioPath, '', (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      setDuration(sound.getDuration());
      console.log('Audio duration:', sound.getDuration(), 'seconds');
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Generate Audio" onPress={generateAudio} />
      {audioUrl && (
        <>
          <Text>Audio file saved at: {audioUrl}</Text>
          <Text>Audio Duration: {duration.toFixed(2)} seconds</Text>
        </>
      )}
    </View>
  );
};

export default Temp;

  // {
      //   "panel_number": 2,
      //   "panel": {
      //     "content": [
      //       {
      //         "character": "Mark Grayson",
      //         "dialogue": "Just another routine day... or so I thought.",
      //         "emotion": "neutral",
      //         "positioning_of_character": "positioned together",
      //         "action_being_performed_or_state_of_character": "standing"
      //       }
      //     ],
      //     "location_and_environment": "A bustling school hallway where students crowd around lockers, laughing and talking. Sunlight streams in through large windows, illuminating the scene with a warm, welcoming glow. The atmosphere is lively and full of youthful energy.",
      //     "indoor_or_outdoor": "indoor",
      //     "weather": "day",
      //     "background_sound": "people bustling",
      //     "background_music": "instrumental"
      //   }
      // },
      // {
      //   "panel_number": 3,
      //   "panel": {
      //     "content": [
      //       {
      //         "character": "Mark Grayson",
      //         "dialogue": "Something's happening... I feel different.",
      //         "emotion": "surprised",
      //         "positioning_of_character": "positioned together",
      //         "action_being_performed_or_state_of_character": "standing"
      //       }
      //     ],
      //     "location_and_environment": "A typical American high school classroom with rows of desks and a large board at the front. A giant map of the world adorns one wall, while student projects are displayed on another.",
      //     "indoor_or_outdoor": "indoor",
      //     "weather": "day",
      //     "background_sound": "no sound",
      //     "background_music": "no music"
      //   }
      // },
      // {
      //   "panel_number": 4,
      //   "panel": {
      //     "character": "Mark Grayson",
      //     "reason_for_focusing": "powerful/super entry",
      //     "location_and_environment": "A bright kitchen with modern appliances and a wooden dining table. Sunlight pours in from a window, making the room feel cozy and inviting. There are family pictures on the fridge, and a bowl of fruit sits on the table.",
      //     "indoor_or_outdoor": "indoor",
      //     "weather": "day",
      //     "background_sound": "no sound",
      //     "background_music": "no music"
      //   }
      // },
      // {
      //   "panel_number": 5,
      //   "panel": {
      //     "content": [
      //       {
      //         "character": "Mark Grayson",
      //         "dialogue": "I can... I'm actually floating!",
      //         "emotion": "surprised",
      //         "positioning_of_character": "positioned together",
      //         "action_being_performed_or_state_of_character": "flying"
      //       }
      //     ],
      //     "location_and_environment": "A small suburban living room with a comfortable sofa and a flat-screen TV. There are shelves filled with books and family photos. A soft carpet covers the wooden floor, adding warmth to the homey atmosphere.",
      //     "indoor_or_outdoor": "indoor",
      //     "weather": "day",
      //     "background_sound": "no sound",
      //     "background_music": "mystery"
      //   }
      // },
      // {
      //   "panel_number": 6,
      //   "panel": {
      //     "description_of_the_shot": "A clear afternoon sky with a wide blue expanse. Below, the cityscape is visible with skyscrapers and green parks dotting the landscape. The sun is still high, casting a gentle glow over everything.",
      //     "type_of_shot": "bird-eye",
      //     "background_sound": "wind",
      //     "background_music": "epic_orchestral"
      //   }
      // },
      // {
      //   "panel_number": 7,
      //   "panel": {
      //     "character": "Mark Grayson",
      //     "reason_for_focusing": "normal entry",
      //     "location_and_environment": "A clear afternoon sky with a wide blue expanse. Below, the cityscape is visible with skyscrapers and green parks dotting the landscape. The sun is still high, casting a gentle glow over everything.",
      //     "indoor_or_outdoor": "outdoor",
      //     "background_sound": "wind",
      //     "background_music": "epic_orchestral"
      //   }
      // },
      // {
      //   "panel_number": 8,
      //   "panel": {
      //     "content": [
      //       {
      //         "character": "Nolan Grayson",
      //         "dialogue": "Ready for your first lesson, son?",
      //         "emotion": "happy",
      //         "positioning_of_character": "positioned opposite to one another",
      //         "action_being_performed_or_state_of_character": "standing"
      //       },
      //       {
      //         "character": "Mark Grayson",
      //         "dialogue": "Let's do this!",
      //         "emotion": "happy",
      //         "positioning_of_character": "positioned opposite to one another",
      //         "action_being_performed_or_state_of_character": "ready_for_attack"
      //       }
      //     ],
      //     "location_and_environment": "An open field at the outskirts of the city, with lush grass stretching as far as the eye can see. The skyline is visible in the distance, providing a sense of proximity to urban life while remaining secluded enough for privacy.",
      //     "indoor_or_outdoor": "outdoor",
      //     "weather": "day",
      //     "background_sound": "wind",
      //     "background_music": "adventure"
      //   }
      // },
      // {
      //   "panel_number": 9,
      //   "panel": {
      //     "sequence_of_actions": [
      //       {
      //         "character": "Nolan Grayson",
      //         "action": "throws a powerful punch, aiming towards Mark with speed and precision.",
      //         "pose": "ready for attack",
      //         "power_used": "super strength"
      //       },
      //       {
      //         "character": "Mark Grayson",
      //         "action": "dodges swiftly, flying upwards to gain altitude.",
      //         "pose": "'evasive maneuver'",
      //         "power_used": "flight"
      //       },
      //       {
      //         "character": "Nolan Grayson",
      //         "action": "launches into the sky, closing the distance quickly.",
      //         "pose": "super pursuit",
      //         "power_used": "flight"
      //       },
      //       {
      //         "character": "Mark Grayson",
      //         "action": "retaliates with a strong kick, sending shockwaves through the air.",
      //         "pose": "counterattack stance",
      //         "power_used": "enhanced strength"
      //       }
      //     ],
      //     "team_winning": [
      //       "Nolan Grayson",
      //       "Mark Grayson"
      //     ],
      //     "losing_team": [],
      //     "location_and_environment": "High above the cityscape, amidst the clouds and a clear blue sky. Rays of sunshine peak through the cloud cover, casting radiant beams that play across the air. Below, the city continues its bustle, unaware of the aerial activity.",
      //     "indoor_or_outdoor": "outdoor",
      //     "weather": "day",
      //     "background_sound": "wind",
      //     "background_music": "epic_orchestral"
      //   }
      // }
