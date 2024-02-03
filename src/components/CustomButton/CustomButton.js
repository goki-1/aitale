import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import apple from '../../../assets/images/apple.png';
import google from '../../../assets/images/google.png';
const CustomButton = ({onPress, text, type = 'PRIMARY', bgColor, fgColor, logoType}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {},
      ]}>
      
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? {color: fgColor} : {},
        ]}>
        {text}
      </Text>
      
      {logoType === 'apple' && <Image source={apple} style={styles.logo} />}
      {logoType === 'google' && <Image source={google} style={styles.logo} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

    padding: 15,
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 15,
  },

  container_PRIMARY: {
    backgroundColor: '#3B71F3',
  },

  container_SECONDARY: {
    borderColor: '#3B71F3',
    borderWidth: 2,
  },

  container_TERTIARY: {},

  text: {
    fontWeight: 'bold',
    color: 'white',
  },

  text_SECONDARY: {
    color: '#3B71F3',
  },

  text_TERTIARY: {
    color: 'gray',
  },
  logo: {
    width: 20, // Adjust the width as needed
    height: 20, // Adjust the height as needed
    marginTop:10 // Added spacing between logo and text
  },
});

export default CustomButton;
