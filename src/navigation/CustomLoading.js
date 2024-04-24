import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';

const CustomLoading = () => {
  const loadingTexts = [
    'Fans want fewer plot holes',
    'Fans just want to see good stories (and also Ironman suiting up one more time)',
    'Fans want proper character developments...',
    "Fans don't want villains to get weaker, just because it's the end of the movie",
  ];

  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loadingTexts.length);
    setCurrentText(loadingTexts[randomIndex]);

    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Logo_1.png')} style={styles.logo} />
      <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
        {currentText}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Set your background color
  },
  logo: {
    width: 70, // Set the width of your logo
    height: 70, // Set the height of your logo
    marginBottom: 20,
    //borderRadius:200,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333', // Set the text color
  },
});

export default CustomLoading;
