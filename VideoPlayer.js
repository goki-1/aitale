import React, { useRef, useEffect, useState, useContext } from 'react';
import { Image, View, Animated, StyleSheet, TouchableOpacity, Text, Dimensions, Pressable } from 'react-native';
import { BlurView } from '@react-native-community/blur';
const SCREEN_WIDTH = Dimensions.get('window').width / 1.0;
const SCREEN_HEIGHT = Dimensions.get('window').height / 2.8;
const PANEL_DURATION = 5000; 
import Tts from 'react-native-tts';
charactersVoiceMap = {};
import Sound from 'react-native-sound'
import AppContext from './AppContext';
//import data from './schema3.js'
let sound, music;

const AssignCharac = (response) => {
        
      //malevoices = ['en-us-x-iom-local', 'en-us-x-tpd-local','en-us-x-iol-local', 'en-au-x-aub-local', 'en-au-x-aud-local', 'en-gb-x-gbd-local', 'en-gb-x-gbg-local'];
      malevoices = ['en-us-x-iom-local']
      //femalevoices = ['en-us-x-sfg-local', 'en-us-x-iob-local', 'en-us-x-iog-local', 'en-us-x-tpc-local', 'en-NG-language', 'en-gb-x-gbg-local'];
      femalevoices = ['en-us-x-iom-local']
      let i = 0, j = 0;
      response.characters.forEach(character => {
        const { character: characterName, sound: sound } = character;
        if (sound === 'male') {
          charactersVoiceMap[characterName] = malevoices[i % malevoices.length];
          i++;
        } else if (sound === 'female') {
          charactersVoiceMap[characterName] = femalevoices[j % femalevoices.length];
          j++;
        } else if (sound === 'deep sound') {
          charactersVoiceMap[characterName] = "MMM" + malevoices[i % malevoices.length];
          i++;
        }
      });
      charactersVoiceMap["Narrator"] = 'en-us-x-iom-local';
}

const Speakc = (panel) => {
  let soundPath;
  
  console.log(panel.background_sound);
  if (panel.background_sound === "no sound");
  else if (panel.background_sound === "wind" || panel.background_sound === 'people bustling' || panel.background_sound === "car sound"){
    // soundPath = 'wind.mp3';  
  }
  else if (panel.background_sound == "birds chirping")
    soundPath = 'birds.mp3'; 
  else if (panel.background_sound == "rain")
    soundPath = 'rain.mp3'; 
  else if (panel.background_sound == "thunder")
    soundPath = 'thunder.mp3'; 
  else if (panel.background_sound == "ocean/river waves")
    soundPath = 'ocean.mp3'; 
  else if (panel.background_sound == "explosion")
    soundPath = 'explosion.mp3'; 
  if(soundPath){
    Sound.setCategory('Playback');
    
    sound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error loading sound:', error);
        return;
      }
      // Loop the audio
      sound.setNumberOfLoops(0); 
      sound.play((success) => {
        if (success) {
          console.log("sound finished---------")
          sound.stop();
          sound.release();
        } else {
          console.log('Error playing sound');
        }
      });
    }); 
  }

  let musicPath;
  const silenceDuration = 3000;
  console.log(panel.background_music);
  if (panel.background_music == "no music" || panel.content[0].dialogue.length < 30);
  else {
    musicPath = '' + panel.background_music + '.mp3';
    Sound.setCategory('Playback');
    if(panel.background_music == "instrumental" || panel.background_music == "epic_orchestral" || panel.background_music == "fantasy" || panel.background_music == "horror" || 
    panel.background_music == "romantic" || panel.background_music == "mystery" || panel.background_music == "sad" || panel.background_music == "adventure"){
       //setTimeout(() => {
        const silence = new Sound('silence.mp3', null, (error) => {
          if (error) {
            console.log('Error creating silence:', error);
            return;
          }
      
          // Create the music sound instance
           music = new Sound(musicPath, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('Error loading music:', error);
              return;
            }
       
            music.setVolume(0.3);
            music.setNumberOfLoops(0); // Play the audio once without looping
      
            // Start playing the silence first
            silence.play((success) => {
              if (success) {
                // After the silence, start playing the actual sound
                setTimeout(() => {
                  music.play((success) => {
                    if (success) {
                      // Sound playback finished, stop and release the sound
                      music.stop();
                      music.release();
                    } else {
                      console.log('Error playing sound');
                    }
                  });
                }, silenceDuration);
              } else {
                console.log('Error playing silence');
              }
            });
          });
        //});
     //}, 4000);
  })
}
  }
  
  
  const content = panel.content;

  let characterIndex = 0;
  while (characterIndex < content.length) {
    const { character, dialogue, tone } = content[characterIndex];
    let voiceId = 'en-us-x-iom-local';
    let rate = 0.4
    let pitch = 1; // Default pitch value for normal tone
    if (tone === 'happy') {
      pitch = 1.2; // Increase pitch for a happy tone
    } else if (tone === 'angry') {
      pitch = 0.6; 
      rate = 0.45;
    }
    else if (tone === 'excited') {
    pitch = 1;
    rate = 0.5;
    }
    else if (tone === 'sad') {
      pitch = 0.85;
      rate = 0.4;
    }
    else if (tone === 'menacing') {
      pitch = 0.65;
      rate = 0.4;
    }
    else if (tone === 'serious') {
      pitch = 1;
      rate = 0.4;
    }
    else if (tone === 'determined') {
      pitch = 1;
      rate = 0.4;
    }
    else{
      pitch = 1;
      rate = 0.4;
    }
    voiceId = charactersVoiceMap[character];
    // if(voiceId.includes("MMM")){
    //   voiceId = voiceId.replace(/MMM/g, '');
    //   pitch -= .3;
    //   rate = .3;
    // }
    Tts.setDefaultRate(rate); // Adjust the speaking rate (0.0 - 1.0)
    Tts.setDefaultPitch(pitch); // Set the pitch value based on tone
    Tts.setDefaultVoice(voiceId); // Set the voice ID based on character sound
    if(character === ""){
      characterIndex++; 
      continue;
    }
    Tts.speak(dialogue); // Speak the current dialogue

    characterIndex++;
  }
      
};


const AnimatedImage = ({ imageUrl, translateY, scale, cameraMovement, translateX, characterImages, panelindex, translateXX, translateYY, scalee, types, panel }) => {
  const getAnimation = () => {
    const zoomInAnimation = () => {
      switch (cameraMovement) {
        case 'left to right':
          return Animated.parallel([
            Animated.timing(translateX, { toValue: -10, duration: 1, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1.05, duration: 1, useNativeDriver: true }),
          ]);

        case 'right to left':
          return Animated.parallel([
            Animated.timing(translateX, { toValue: 10, duration: 1, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1.05, duration: 1, useNativeDriver: true }),
          ]);
  
        case 'up':
          return Animated.parallel([
            Animated.timing(translateY, { toValue: 0.02, duration: 1, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1.05, duration: 1, useNativeDriver: true }),
          ]);
  
        case 'down':
          return Animated.parallel([
            Animated.timing(translateY, { toValue: -0.02, duration: 1, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1.05, duration: 1, useNativeDriver: true }),
          ]);
  
        case 'zoom out':
          return Animated.timing(scale, { toValue: 1.05, duration: 1, useNativeDriver: true });
  
        default:
          return null;
      }
    }
    const mainAnimation = () => {
      switch (cameraMovement) {
        case 'up':
          return Animated.timing(translateY, { toValue: -0.02, duration: PANEL_DURATION, useNativeDriver: true });
        case 'down':
          return Animated.timing(translateY, { toValue: 0.02, duration: PANEL_DURATION, useNativeDriver: true });
        case 'zoom in':
          return Animated.timing(scale, { toValue: 1.05, duration: PANEL_DURATION, useNativeDriver: true });
        case 'zoom out':
          return Animated.timing(scale, { toValue: 1, duration: PANEL_DURATION, useNativeDriver: true });
        case 'left to right':
          return Animated.timing(translateX, { toValue: 10, duration: PANEL_DURATION, useNativeDriver: true });
        case 'right to left':
          return Animated.timing(translateX, { toValue: -10, duration: PANEL_DURATION, useNativeDriver: true });
        case 'zoom in and up':
          {
            const scaleAnimation = Animated.timing(scalee, { toValue: 1.7, duration: 1, useNativeDriver: true });
            const translateAnimation = Animated.timing(translateYY, { toValue: 100, duration: PANEL_DURATION, useNativeDriver: true });
            
            const scaleAnimation2 = Animated.timing(scale, { toValue: 1.7, duration: 1, useNativeDriver: true });
            const translateAnimation2 = Animated.timing(translateY, { toValue: 30, duration: PANEL_DURATION, useNativeDriver: true });
            
            return Animated.parallel([scaleAnimation, translateAnimation, scaleAnimation2, translateAnimation2]);
          }        
        case 'some random zoom in':
          {
            const scaleAnimation = Animated.timing(scalee, { toValue: 3, duration: 1, useNativeDriver: true });
            const translateAnimation = Animated.timing(translateYY, { toValue: 200, duration: 1, useNativeDriver: true });
            
            const scaleAnimation2 = Animated.timing(scale, { toValue: 1.7, duration: 1, useNativeDriver: true });
            const translateAnimation2 = Animated.timing(translateY, { toValue: 18, duration: 1, useNativeDriver: true });
            
            return Animated.parallel([scaleAnimation, translateAnimation, scaleAnimation2, translateAnimation2]);
          }
          case 'close up':
          {
            const scaleAnimation = Animated.timing(scalee, { toValue: 3.8, duration: 1, useNativeDriver: true });
            const translateAnimation = Animated.timing(translateYY, { toValue: 300, duration: 3, useNativeDriver: true });
            
            const scaleAnimation2 = Animated.timing(scale, { toValue: 2, duration: 1, useNativeDriver: true });
            const translateAnimation2 = Animated.timing(translateX, { toValue: 18, duration: 3000, useNativeDriver: true });
            
            return Animated.parallel([scaleAnimation, translateAnimation, scaleAnimation2, translateAnimation2]);
          }
            default:
          return Animated.timing(translateY, { toValue: 0, duration: PANEL_DURATION, useNativeDriver: true });
      }
    };

    return Animated.sequence([zoomInAnimation(), mainAnimation()].filter(Boolean));
  };

  useEffect(() => {
    translateY.setValue(0);
    translateX.setValue(0);
    scale.setValue(1);
    translateYY.setValue(0);
    translateXX.setValue(0);
    scalee.setValue(1);

    const animation = getAnimation();
    animation.start();
  }, [panelindex]);

  const calculateCharacterPosition = (character, index) => {
   
    const { character_relative_location_in_panel } = character;
    const baseTop = SCREEN_HEIGHT/11; 
    const leftSpacing = SCREEN_WIDTH/3;
    if (cameraMovement == "zoom in and up" ){
        return {
          position: 'absolute',
          top: SCREEN_HEIGHT/20,
          left: 0,
        };
    }
    else if (cameraMovement == "some random zoom in" ){
      return {
        position: 'absolute',
        top: SCREEN_HEIGHT/20,
        left: 0, 
      };
    }
    else if (cameraMovement == "close up" ){
      return {
        position: 'absolute',
        top: SCREEN_HEIGHT/20,
        left: 0, 
      };
    }
    else {
      if (character_relative_location_in_panel === 'center') {
        return {
          position: 'absolute',
          top: SCREEN_HEIGHT/20,
          left: 0, // Center horizontally
        };
      }
      shouldFlip = character.character_relative_location_in_panel === 'left';
      // const additionalTop = (index) * baseTop;
      
      const additionalLeft = character_relative_location_in_panel === 'left' ? -index * leftSpacing : index * leftSpacing;
    
      return {
        position: 'absolute',
        top: baseTop ,
        left: 0 + additionalLeft,
      };
    }
  };
  let shouldFlip = false;
  const animateCharacterImage = (character, index) => {
    const positionStyle = calculateCharacterPosition(character, index);

    return (
      character.poseImageId && (
        <Animated.Image
          key={index}
          source={{ uri: 'https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/' + character.poseImageId }}
          //source={{ uri: character.poseImageId }}
          //onError={(error) => console.error('Error loading image:', error)}
          style={[
            styles.characterImage,
            positionStyle,
            {
              transform: [
                { translateY:translateYY }, // Add any other transformations here as needed
                { scale:scalee },
                {translateX: translateXX},
                { scaleX: shouldFlip ? -1 : 1 },
              ],
            },
          ]}
        />
      )
    );
  };
  const blurAmount = types === "character dialogues single" ? 30 : 1;
  //console.log(blurAmount);
  if(types === "character dialogues single" || types === "narrator"){
    Speakc(panel);
  }
  return (
    <View  style={styles.canvas} >
    
      <Animated.Image
      source={{ uri: 'https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/' + imageUrl }}
        //source={{ uri: imageUrl }}
        //onError={(error) => console.error('Error loading image:::::::::::', error)}
        style={[
          styles.image,
          { transform: [{ translateY }, { translateX }, { scale }] },
          ]}
      />
      { blurAmount == 30 &&
      <BlurView
        style={styles.image}
        blurType="light"
        blurAmount={1}
    
      />}
  {characterImages.map((character, index) => animateCharacterImage(character, index))}
    
</View >

  );
};
const calculatePanelDuration = (panel) => {
  const baseDurationPerCharacter = 100; // milliseconds per character
  const additionalDurationPerPeriod = 1000; // additional milliseconds for each full stop
if(panel.type === 'object'){
  return 2000;
}
  let totalDuration = 0;
  panel.content.forEach(dialogue => {
    // Calculate base duration based on character count
    totalDuration += dialogue.dialogue.length * baseDurationPerCharacter;

    // Add additional time for each full stop
    const periodCount = (dialogue.dialogue.match(/\./g) || []).length;
    totalDuration += periodCount * additionalDurationPerPeriod;
  });

  return totalDuration;
};

const VideoPlayer = ({ data }) => {
  
  console.log("keyyyyyyyy")
  if(sound){
    sound.stop();
    sound.release();
  }
  if(music){
    music.stop();
    music.release();
  }
  AssignCharac(data);
  // const { value } = useContext(AppContext);
  const [currentPanelIndex, setCurrentPanelIndex] = React.useState(0);

  const preloadPanelImages = (panel) => {
    const imageUrls = [];
  console.log("iiiiiiiiiiiiiii")
    // Add background image URL if exists
    if (panel.genId) {
      imageUrls.push(panel.genId);
    }
  
    // Add character image URLs if exist
    panel.content.forEach((item) => {
      if (item.poseImageId) {
        imageUrls.push(item.poseImageId);
      }
    });
  
    // Prefetch all images and return a promise that resolves when all prefetches are done
    const prefetchPromises = imageUrls.map((url) => Image.prefetch('https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/'+url));
    return Promise.all(prefetchPromises);
  };  

// useEffect(() => {
//   AssignCharac(data);
//   if(sound){
//     sound.stop();
//     sound.release();
//   }
//   if(music){
//     music.stop();
//     music.release();
//   }
//   console.log("qqqqqqqqqqqqqqqq")
//   return () => {
//     if(sound){
//       sound.stop();
//       sound.release();
//     }
//     if(music){
//       music.stop();
//       music.release();
//     } // Release the sound resources
//   };
// })

  useEffect(() => {
    const currentPanel = data.panels[currentPanelIndex];
    if(sound){
      sound.stop();
      sound.release();
    }
    if(music){
      music.stop();
      music.release();
    }
    console.log("================")
    // Preload images for the current panel before setting the timeout for the panel change
    preloadPanelImages(currentPanel).then(() => {
      // Once images are preloaded, set a timeout for the next panel transition
      const duration = calculatePanelDuration(currentPanel);
      const nextPanelTimeout = setTimeout(() => {
        if (currentPanelIndex < data.panels.length - 1) {
          setCurrentPanelIndex(currentPanelIndex + 1);
        }
      }, duration);
  
      return () => clearTimeout(nextPanelTimeout);
    });
  }, [currentPanelIndex, data.panels]);

  // useEffect(() => {
  //   console.log("changeddddddd", value)
  //   if(sound){
  //     sound.stop();
  //     sound.release();
  //   }
  //   if(music){
  //     music.stop();
  //     music.release();
  //   }
  //   return () => {
  //     if(sound){
  //       sound.stop();
  //       sound.release();
  //     }
  //     if(music){
  //       music.stop();
  //       music.release();
  //     } // Release the sound resources
  //   };
  // }, [value, keye]);
  
  // const handlePress = () => {
  //   //console.log("j,fgq,hsvhjb")
  //   setCurrentPanelIndex(0);
  //   Tts.stop();
  // };


  return (
    
    <View style={styles.canvas}>
    
      {data.panels && data.panels.length > 0 && (
        <View>
          <AnimatedImage
            imageUrl={data.panels[currentPanelIndex].genId}
            translateY={new Animated.Value(0)}
            translateYY={new Animated.Value(0)}
            translateX={new Animated.Value(0)}
            translateXX={new Animated.Value(0)}
            scale={new Animated.Value(0)}
            scalee={new Animated.Value(0)}
            cameraMovement={data.panels[currentPanelIndex].camera_movement}
            characterImages={data.panels[currentPanelIndex].content}
            panelindex = {currentPanelIndex}
            types = {data.panels[currentPanelIndex].type}
            panel = {data.panels[currentPanelIndex]}
          />
          <View style={{ position: 'absolute', bottom: 0, padding: 10 }}>
            {data.panels[currentPanelIndex] &&
              (data.panels[currentPanelIndex].type === 'character dialogues single' || data.panels[currentPanelIndex].type === 'narrator') && (
                <View>
                  {data.panels[currentPanelIndex].content.map((dialogue, indexx) => (
                    <View key={indexx}>
                      {dialogue.dialogue !== "" &&
                      <Text style={{ color: 'white', fontWeight: 'bold', backgroundColor:'black' }}>{dialogue.character}: {dialogue.dialogue}</Text>}
                      
                      
                    </View>
                  ))}
                </View>
              )}
          </View>
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position:'absolute',
  },
  characterImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default VideoPlayer;
