import React, { useRef, useEffect, useState } from 'react';
import { Image, View, Animated, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';
const SCREEN_WIDTH = Dimensions.get('window').width / 1.028;
const SCREEN_HEIGHT = Dimensions.get('window').height / 2.8;
const PANEL_DURATION = 5000; // 6 seconds
import Tts from 'react-native-tts';
charactersVoiceMap = {};

const getRandomExtremeValue = () => Math.round(Math.random());

const createCharacterDialogueSinglePanel = (parentPanel, character, index, initialAppearances) => {
  
  const isInitialAppearance = !initialAppearances.includes(character.character);

  const cameraMovement = isInitialAppearance
    ? { camera_movement: 'zoom in and up' }
    : { camera_movement: 'some random zoom in'};

  return {
    type: 'character dialogues single',
    content: [{
      character: character.character,
      dialogue: character.dialogue,
      gen_id: character.gen_id,
      tone: character.tone,
      pose: character.pose,
      character_relative_location_in_panel: character.character_relative_location_in_panel,
    },],
    background_music: parentPanel.background_music,
    index: index,
    gen_id: parentPanel.gen_id,
    ...cameraMovement,
  };
};

// Main function to transform the original JSON
const transformJson = (originalJson) => {
  let currentIndex = 0;
  const charactersWithInitialAppearance = [];

  const transformedJson = {
    ...originalJson,
    panels: originalJson.panels.flatMap((panel, panelIndex) => {
      const modifiedPanel = {
        ...panel,
        index: currentIndex++,
      };

      const newPanels = [modifiedPanel];
  
      if (panel.type === 'narrator' || panel.type === 'scene with no characters') {
        if (panel.camera_movement === 'right to left' || panel.camera_movement === 'left to right') {
          modifiedPanel.extreme = getRandomExtremeValue();
        }
      } else if (panel.type === 'character dialogues') {
        panel.content.forEach((character, characterIndex) => {
          
          const characterDialogueSinglePanel = createCharacterDialogueSinglePanel(
            modifiedPanel,
            character,
            currentIndex,
            charactersWithInitialAppearance
          );

          if (!charactersWithInitialAppearance.includes(character.character)) {
            charactersWithInitialAppearance.push(character.character);
          }
          currentIndex++;
          newPanels.push(characterDialogueSinglePanel);
        });
      }

      return newPanels;
    }),
  };

  return transformedJson;
};


const AssignCharac = (response) => {
        
      malevoices = ['en-us-x-iom-local', 'en-us-x-tpd-local','en-us-x-iol-local', 'en-au-x-aub-local', 'en-au-x-aud-local', 'en-gb-x-gbd-local', 'en-gb-x-gbg-local'];
      femalevoices = ['en-us-x-sfg-local', 'en-us-x-iob-local', 'en-us-x-iog-local', 'en-us-x-tpc-local', 'en-NG-language', 'en-gb-x-gbg-local'];
      
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
      charactersVoiceMap["narrator"] = 'en-gb-x-gbg-local';
}


const Speakc = (panel) => {
      
        const content = panel.content;

        let characterIndex = 0;
        while (characterIndex < content.length) {
          const { character, dialogue, tone } = content[characterIndex];
          let voiceId = 'en-us-x-iom-local';
          let rate = 0.5
          let pitch = 1; // Default pitch value for normal tone
          if (tone === 'happy') {
            pitch = 1.2; // Increase pitch for a happy tone
          } else if (tone === 'angry') {
            pitch = 0.6; 
            rate = 0.45;
          }
          else if (tone === 'excited') {
          pitch = 1.1;
          rate = 0.65;
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
          }
          voiceId = charactersVoiceMap[character];
          if(voiceId.includes("MMM")){
            voiceId = voiceId.replace(/MMM/g, '');
            pitch -= .3;
            rate = .3;
          }
          Tts.setDefaultRate(rate); // Adjust the speaking rate (0.0 - 1.0)
          Tts.setDefaultPitch(pitch); // Set the pitch value based on tone
          Tts.setDefaultVoice(voiceId); // Set the voice ID based on character sound

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
            const scaleAnimation = Animated.timing(scalee, { toValue: 2.7, duration: 1, useNativeDriver: true });
            const translateAnimation = Animated.timing(translateYY, { toValue: 200, duration: 1, useNativeDriver: true });
            
            const scaleAnimation2 = Animated.timing(scale, { toValue: 1.7, duration: 1, useNativeDriver: true });
            const translateAnimation2 = Animated.timing(translateY, { toValue: 18, duration: 1, useNativeDriver: true });
            
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
    const leftSpacing = SCREEN_WIDTH/4;
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
    else {
      if (character_relative_location_in_panel === 'center') {
        return {
          position: 'absolute',
          top: SCREEN_HEIGHT/20,
          left: 0, // Center horizontally
        };
      }
    
      const additionalTop = (index) * baseTop;
      const additionalLeft = character_relative_location_in_panel === 'left' ? -index * leftSpacing : index * leftSpacing;
    
      return {
        position: 'absolute',
        top: baseTop + additionalTop,
        left: 0 + additionalLeft,
      };
    }
  };

  const animateCharacterImage = (character, index) => {
    const positionStyle = calculateCharacterPosition(character, index);

    return (
      character.gen_id && (
        <Animated.Image
          key={index}
          source={{ uri: character.gen_id }}
          style={[
            styles.characterImage,
            positionStyle,
            {
              transform: [
                { translateY:translateYY }, // Add any other transformations here as needed
                { scale:scalee },
                {translateX: translateXX},
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
    <View style={styles.canvas}>
    
      <Animated.Image
        source={{ uri: imageUrl }}
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
    
</View>

  );
};

const VideoPlayer = ({ data }) => {
  const [currentPanelIndex, setCurrentPanelIndex] = React.useState(0);
  AssignCharac(data);
  data = transformJson(data);

  useEffect(() => {
    const preloadImages = async () => {
      if (data.panels[currentPanelIndex]) {
        const imagePromises = [Image.prefetch(data.panels[currentPanelIndex].gen_id)];

        data.panels[currentPanelIndex].content.forEach(character => {
          imagePromises.push(Image.prefetch(character.gen_id));
        });

        await Promise.all(imagePromises);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const nextPanelTimeout = setTimeout(() => {
      if (currentPanelIndex < data.panels.length - 1) {
        setCurrentPanelIndex(currentPanelIndex + 1);
      }
    }, PANEL_DURATION);

    return () => clearTimeout(nextPanelTimeout);
  }, [currentPanelIndex]);

  const handlePress = () => {
    setCurrentPanelIndex(0);
 
  };

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={handlePress}>
      {data.panels && data.panels.length > 0 && (
        <View>
          <AnimatedImage
            imageUrl={data.panels[currentPanelIndex].gen_id}
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
                      <Text style={{ color: 'white', fontWeight: 'bold', backgroundColor:'black' }}>{dialogue.character}: {dialogue.dialogue}</Text>
                      
                    </View>
                  ))}
                </View>
              )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
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
