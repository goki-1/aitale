import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import Sound from 'react-native-sound';
import { BlurView } from '@react-native-community/blur';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height / 2.8;

let sound, music;

const CustomAnimatedImage2 = ({ sour }) => {
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);
  const scale = new Animated.Value(1);

  // Get number of characters in the panel
  const numberOfCharacters = sour.content.length;

  // Dynamically calculate scale factor based on the number of characters
  const scaleFactor = numberOfCharacters === 1 ? 1.7 : 1.3;

  //useEffect(() => {
    // Animate only if there's one character
    if (numberOfCharacters === 1) {
    
        let soun = new Sound(sour.content[0].dialoguePathUrl, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Error loading sound:', error);
            return;
          }
          soun.setNumberOfLoops(0);
          soun.play((success) => {
            if (success) {
              console.log(sour.content[0].dialoguePathUrl, "playing")
            }
            if (!success) {
              console.log('Error playing sound');
            }
          });
        });
    
      Animated.parallel([
        Animated.timing(scale, {
          toValue: scaleFactor, // Scale up for a close-up effect
          duration: 1, // Duration of the scaling animation
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10, // Example Y translation for a close-up
          duration: 2000, // Same duration to sync the animations
          useNativeDriver: true,
        }),
      ]).start();
    }
  //}, [numberOfCharacters, scaleFactor]);

  // Style variations based on the number of characters
  let positionStyle = {};
  if (numberOfCharacters === 1) {
    positionStyle = { top: SCREEN_HEIGHT / 4, left: 0 }; // Close-up style for one character
  } else if (numberOfCharacters === 2) {
    positionStyle = { top: SCREEN_HEIGHT / 3, left: SCREEN_WIDTH / 15 }; // Side-by-side positioning for two characters
  } else if (numberOfCharacters >= 3) {
    positionStyle = { top: SCREEN_HEIGHT / 3.5, left: SCREEN_WIDTH / 12 }; // Adjusted positioning for more than two characters
  }

  // Dynamically calculate width and height based on the number of characters
  const imageSize = {
    width: SCREEN_WIDTH / (numberOfCharacters), // Adjust size based on number of characters
    height: SCREEN_HEIGHT ,
  };

  return (
    <View style={{ flexDirection: "row"}}>
      {sour.content.map((character, index) => (
        <Animated.Image
          key={index}
          source={{ uri: character.characId0 }}
          style={[
            styles.characterImage,
            imageSize, // Adjust image size based on the number of characters
            positionStyle,
            numberOfCharacters === 1
              ? {
                  transform: [
                    { translateY: translateY }, // Only animate translateY and scale if there's one character
                    { scale: scale },
                    { translateX: translateX },
                  ],
                }
              : {
                  transform: [{ scale: scaleFactor }], // For more than one character, only apply scaling
                },
          ]}
          resizeMode="contain"
        />
      ))}
    </View>
  );
};


const CustomAnimatedImage3 = ({ sour }) => {
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);
  const scale = new Animated.Value(1);
  Animated.parallel([
    Animated.timing(scale, {
      toValue: 1.2,
      duration: 2, 
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: -22,
      duration: 2000, 
      useNativeDriver: true,
    }),
    
  ]).start();
  positionStyle = {top:SCREEN_HEIGHT/25,left: 0}
  // if(panel.reason_of_focusing){
    return (
      <Animated.Image
      
      source={{ uri: sour.sequence_of_actions[0].characId0}}
      style={[
        styles.characterImage,
        positionStyle,
        {
          transform: [
            { translateY:translateY }, // Add any other transformations here as needed
            { scale:scale },
            {translateX: translateX},
          
          ],
        },
      ]}
    />
    )
  //}
}



const CustomAnimatedImage = ({ sourceP }) => {
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);
  const scale = new Animated.Value(1);
  Animated.parallel([
    Animated.timing(scale, {
      toValue: 1.4,
      duration: 1, 
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 120, // Example value for X translation
      duration: 5000, // Same duration to sync the animations
      useNativeDriver: true,
    }),
  ]).start();
  positionStyle = {top:SCREEN_HEIGHT/25,left: 0}
  // if(panel.reason_of_focusing){
    return (
      <Animated.Image
      
      source={{ uri: sourceP}}
      style={[
        styles.characterImage,
        positionStyle,
        {
          transform: [
            { translateY:translateY }, // Add any other transformations here as needed
            { scale:scale },
            {translateX: translateX},
          
          ],
        },
      ]}
    />
    )
  //}
}

const VideoPlayer2 = ({ data, playOrpause }) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const translateXX = useRef(new Animated.Value(0)).current;
  const translateYY = useRef(new Animated.Value(0)).current;
  const scalee = useRef(new Animated.Value(1)).current;

  const intervalRef = useRef(null);
  const [imageStyle, setImageStyle] = useState({});

  const playBackgroundSound = (audio) => {
    if (audio === 'no sound') return;

    
    const soundMap = {
      'wind': 'wind.mp3',
      'birds chirping': 'birds.mp3',
      'rain': 'rain.mp3',
      'thunder': 'thunder.mp3',
      'ocean/river waves': 'ocean.mp3',
      'explosion': 'explosion.mp3',
    };

    const soundPath = soundMap[audio];
    console.log(soundPath, "sound playing")
    if (!soundPath) return;

    sound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error loading sound:', error);
        return;
      }
      sound.setNumberOfLoops(0);
      sound.play((success) => {
        if (success) {
          console.log(soundPath, "playing")
        }
        if (!success) {
          console.log('Error playing sound');
        }
      });
    });
  };

  const playBackgroundMusic = (audio) => {
    if (audio === 'no music') return;

    console.log("music playing")
    const musicMap = {
      "instrumental": 'instrumental.mp3',
      "epic_orchestral": 'epic_orchaestral.mp3',
      "fantasy": 'fantasy.mp3',
      "horror": 'horror.mp3',
      "romantic": 'romantic.mp3',
      "mystery": 'mystery.mp3',
      "sad": 'sad.mp3',
      "adventure": 'adventure.mp3'
    };

    const musicPath = musicMap[audio];
    if (!musicPath) return;

    music = new Sound(musicPath, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error loading music:', error);
        return;
      }
      music.setNumberOfLoops(0);
      music.play((success) => {
        if (!success) {
          console.log('Error playing music');
        }
      });
    });
  };

  const startAnimationsEstablishingPanel = (shot) => {
    if (shot === 'bird-eye' || shot === 'low-shot') {
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 4000,
        useNativeDriver: true,
      }).start();
    } else if (shot === 'vertically-stretched-shot') {
      translateY.setValue(SCREEN_HEIGHT * 0.3);
  
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -SCREEN_HEIGHT * 0.3,
          duration: 1,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 1.3,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (shot === 'horizontally-stretched-shot') {
      translateX.setValue(SCREEN_WIDTH * 0.3);
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH * 0.3,
          duration: 1,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 1.3,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  startAnimationsFocusPanel = ()=>{
    translateY.setValue(SCREEN_HEIGHT * 0.4);
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT * 0.3,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 6.5,
        duration: 5000,
        useNativeDriver: true,
      }),
    ]).start();
  }

  startAnimationsFightPanel = ()=>{
    ran = Math.random() * Math.random()
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 3.5,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT * 0.5,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH * ran * 1.2,
        duration: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }

  startAnimationsDialoguePanel = (number)=>{
    ran = Math.random() * Math.random() 

    if(number == 1){
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 3,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT * 0.5,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH * ran,
        duration: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }
  }

  const resetMedia = () => {
    if (sound) {
      sound.stop();
      sound.release();
    }
    if (music) {
      music.stop();
      music.release();
    }
    translateX.setValue(0); // Reset animation
    translateY.setValue(0);
    scale.setValue(1);
    translateXX.setValue(0); // Reset animation
    translateYY.setValue(0);
    scalee.setValue(1);
  };

  const playPanelMedia = (panel) => {
    resetMedia();

    if(panel.type_of_shot){

      playBackgroundSound(panel.background_sound);
      playBackgroundMusic(panel.background_music);

      startAnimationsEstablishingPanel(panel.type_of_shot);
      let newImageStyle = {};
      if (panel.type_of_shot === 'vertically-stretched-shot') {
        newImageStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 1.5 };
      } else if (panel.type_of_shot === 'horizontally-stretched-shot') {
        newImageStyle = { width: SCREEN_WIDTH * 1.5, height: SCREEN_HEIGHT };
      } else {
        newImageStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
      }
      setImageStyle(newImageStyle);
    }
    else if (panel.reason_for_focusing){
      playBackgroundSound(panel.background_sound);
      playBackgroundMusic(panel.background_music);

      startAnimationsFocusPanel();
      let newImageStyle = {};
      newImageStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT*1.7};
      setImageStyle(newImageStyle);
    }
    else if (panel.content){
      
      startAnimationsDialoguePanel(panel.content.length);
      let newImageStyle = {};
      newImageStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT};
      setImageStyle(newImageStyle);
    }
    else if (panel.sequence_of_actions){
      playBackgroundSound(panel.background_sound);
      playBackgroundMusic(panel.background_music);
      startAnimationsFightPanel();
      let newImageStyle = {};
      newImageStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 1.7};
      setImageStyle(newImageStyle);
    }
  };

  const startPanelInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentPanelIndex((prevIndex) => {
        if (prevIndex + 1 < data.length) {
          return prevIndex + 1;
        } else {
          setIsPlaying(false);
          resetMedia();
          return prevIndex;
        }
      });
    }, data[currentPanelIndex].panel.duration); // Change panel every 4 seconds
  };

  useEffect(() => {
    if (isPlaying) {
      startPanelInterval();
    } else {
      resetMedia();
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current); // Cleanup interval on unmount
    };
  }, [isPlaying]);

  useEffect(() => {
    resetMedia()
    return () => {
      resetMedia()
    };
  }, [playOrpause]);

  useEffect(() => {
    playPanelMedia(data[currentPanelIndex].panel);
    console.log("play")
    startPanelInterval();
  }, [currentPanelIndex]);

  return (
    <View style={styles.canvas}>
    
      <Animated.Image
        source={{ uri: data[currentPanelIndex].panel.genId }}
        style={[
          imageStyle,
          styles.image,
          { transform: [{ translateX }, { translateY }, { scale }] },
        ]}
        resizeMode="cover"
      />
      {data[currentPanelIndex].panel.characId0 != null && (
      <CustomAnimatedImage sourceP={data[currentPanelIndex].panel.characId0} />
    )}

    {data[currentPanelIndex].panel.content && (
      <CustomAnimatedImage2 sour={data[currentPanelIndex].panel} />
    )}

    {data[currentPanelIndex].panel.sequence_of_actions && (
    <>
      <BlurView
        //style={styles.characterImage}
        blurType="light"
        blurAmount={10}
      />
      <CustomAnimatedImage3 sour={data[currentPanelIndex].panel} />
      </>
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
  
    position: 'absolute',
  },
  characterImage : {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT*2,}
});

export default VideoPlayer2;
