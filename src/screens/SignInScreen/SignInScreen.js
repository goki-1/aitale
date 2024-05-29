import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Logo from '../../../assets/images/Logo_1.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {signIn, signOut} from 'aws-amplify/auth';

const SignInScreen = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const signOutt = () => {
    signOut();
  };
  const onSignInPressed = async data => {
    if (loading) {
      return;
    }
    email = data.email
    setLoading(true);
    try {
      const response = await signIn({ username: data.email, password: data.password });
      if (!response.isSignedIn && response.nextStep?.signInStep === "CONFIRM_SIGN_UP"){ 
        navigation.navigate('ConfirmEmail', {email});
      }
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
    setLoading(false);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };
  const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />


<SocialSignInButtons />

        <CustomInput
          name="email"
          control={control}
          placeholder="Email"
          rules={{
            required: 'Email is required',
            pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
          }}
        />

        <CustomInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 3,
              message: 'Password should be minimum 3 characters long',
            },
          }}
        />

        <CustomButton
          text={loading ? 'Loading...' : 'Sign In'}
          onPress={handleSubmit(onSignInPressed)}
        />

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

       
        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
        <Text
        onPress={signOutt}
        style={{
          width: '100%',
          textAlign: 'center',
          color: 'red',
          marginTop: 'auto',
          marginVertical: 20,
          fontSize: 20,
        }}>
        Sign out
      </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    //width: '70%',
    maxWidth: 150,
    maxHeight: 150,
    borderRadius:25,
    marginBottom:20,
  },
});

export default SignInScreen;
