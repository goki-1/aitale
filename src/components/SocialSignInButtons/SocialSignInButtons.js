import React from 'react';
import {View, Text} from 'react-native';
import CustomButton from '../CustomButton';
import { signInWithRedirect } from 'aws-amplify/auth';


const SocialSignInButtons = () => {

  const onSignInGoogle = () => {
    console.warn('onSignInGoogle');
    signInWithRedirect({ provider: 'Google' })
  };

  const onSignInApple = () => {
    console.warn('onSignInApple');
  };

  return (
    <>
      <CustomButton
        text="Continue with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
        logoType='google'
      />
      <CustomButton
        text="Continue with Apple"
        onPress={onSignInApple}
        bgColor="#e3e3e3"
        fgColor="#363636"
        logoType='apple'
      />
    </>
  );
};

export default SocialSignInButtons;
