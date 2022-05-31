/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import MapScreenView from './src/View/MapScreenView';
import { ReviewPage } from './src/View/Review';
// import {
//   Alert,
//   Button,
//   SafeAreaView,
// } from 'react-native';
import ConnectController from './src/ViewController/ConnectController';
import MapScreenController from './src/ViewController/MapScreenController';
import OrderController from './src/ViewController/OrderController';

const App = () => {
 
  return (
   // <MapScreenController />
    <ConnectController/>

   // <SafeAreaView>
    //   <Button title="press"
    //   onPress={()=> {Alert.alert("works"); console.log("log")}}/> 
    // </SafeAreaView>
    //<ReviewPage/>
  );
};

export default App;
