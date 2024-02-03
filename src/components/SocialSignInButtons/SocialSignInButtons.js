import React from 'react';
import {View, Text} from 'react-native';
import CustomButton from '../CustomButton';

const SocialSignInButtons = () => {

  const onSignInGoogle = () => {
    console.warn('onSignInGoogle');
  };

  const onSignInApple = () => {
    console.warn('onSignInApple');
  };

  return (
    <>
      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
        logoType='google'
      />
      <CustomButton
        text="Sign In with Apple"
        onPress={onSignInApple}
        bgColor="#e3e3e3"
        fgColor="#363636"
        logoType='apple'
      />
    </>
  );
};

export default SocialSignInButtons;
