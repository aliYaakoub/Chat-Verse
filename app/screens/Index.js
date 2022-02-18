import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import MainScreen from '../components/navigation/MainScreen';
import ChatScreen from './ChatScreen';
import { useAppContext } from './../config/Context';

const Index = () => {

  const Stack = createNativeStackNavigator();
  const { currentUser } = useAppContext();

  return (
    <NavigationContainer>
        {currentUser ? 
          <Stack.Navigator screenOptions={{headerShown: false}}  >
              <Stack.Screen component={MainScreen} name='Navigator' />
              <Stack.Screen component={ChatScreen} name='Chat' />
          </Stack.Navigator>
          :
          <Stack.Navigator screenOptions={{headerShown: false}}  >
            <Stack.Screen component={LoginScreen} name='Login' />
            <Stack.Screen component={SignupScreen} name='Signup' />
          </Stack.Navigator>
        }
    </NavigationContainer>
  );
};

export default Index;
