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
import AppContext from './AppContext';
import PostTesting from './PostTesting';

const App = () => {
  ///Auth.signOut();
  const [value, setValue] = useState(true);
  return (
    <AppContext.Provider value={{ value, setValue }}>
    <SafeAreaView style={styles.root}>
      <Navigation />
      {/* <PostTesting/> */}
      {/* <Create/> */}
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
