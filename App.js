/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import Navigation from './src/navigation';
import Create from './Create';
import Create2 from './Create2';
import AppContext from './AppContext';
import PostTesting from './PostTesting';
import Temp from './Temp';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator(); 
const App = () => {
  ///Auth.signOut();
  const [value, setValue] = useState(true);
  return (  
    <AppContext.Provider value={{ value, setValue }}>
      <NavigationContainer>
        <SafeAreaView style={styles.root}>
        {/* <Navigation /> */}
        {/* <PostTesting/> */}
        {/* <Create2/> */}
        {/* <Temp/> */}
          <Stack.Navigator initialRouteName="Create2">
            <Stack.Screen name="Create2" component={Create2} options={{ headerShown: false }} />
            <Stack.Screen name="PostTesting" component={PostTesting} options={{ headerShown: false }} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
});

export default App;
