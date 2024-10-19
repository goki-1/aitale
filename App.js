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
const App = () => {
  ///Auth.signOut();
  const [value, setValue] = useState(true);
  return (
    <AppContext.Provider value={{ value, setValue }}>
    <SafeAreaView style={styles.root}>
      {/* <Navigation /> */}
      <PostTesting/>
      {/* <Create2/> */}
      {/* <Temp/> */}
    </SafeAreaView>
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
