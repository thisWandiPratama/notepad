//import liraries
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Route from './src/route'

// create a component
const App = () => {
  return (
    <NavigationContainer>
      <Route />
    </NavigationContainer>
  );
};

export default App;
