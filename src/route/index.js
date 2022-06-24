import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../container/login'
import Home from '../container/home'
// import Add from '../container/add'
import OTP from '../container/otp'

const Stack = createNativeStackNavigator();

function Route() {
  return (
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Home" component={Home} />
        {/* <Stack.Screen name="Add" component={Add} /> */}
        <Stack.Screen name="OTP" component={OTP} />
      </Stack.Navigator>
  );
}

export default Route;