import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import Sound from 'react-native-sound';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height / 2.8;

let sound, music;

const VideoPlayer2 = ({ data, playOrPause }) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const translateX = useRef(new Animated.Value(-10)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const scale = useRef(new Animated.Value(1)).current;
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
      "epic_orchestral": 'epic_orchestral.mp3',
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

  const startAnimations = (shot) => {
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
          duration: 4000,
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
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  

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
  };

  const playPanelMedia = (panel) => {
    resetMedia();
    playBackgroundSound(panel.background_sound);
    playBackgroundMusic(panel.background_music);
    startAnimations(panel.type_of_shot);
    let newImageStyle = {};
    if (panel.type_of_shot === 'vertically-stretched-shot') {
      newImageStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 1.5 };
    } else if (panel.type_of_shot === 'horizontally-stretched-shot') {
      newImageStyle = { width: SCREEN_WIDTH * 1.5, height: SCREEN_HEIGHT };
    } else {
      newImageStyle = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
    }
    setImageStyle(newImageStyle);
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
          return prevIndex;
        }
      });
    }, 4000); // Change panel every 4 seconds
  };

  useEffect(() => {
    if (isPlaying) {
      startPanelInterval();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current); // Cleanup interval on unmount
    };
  }, [isPlaying]);

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
});

export default VideoPlayer2;
