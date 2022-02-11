import React from 'react';
import type {Node} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './src/screens/Home';
import Room from './src/screens/Room';
import AddSuggestions from './src/screens/AddSuggestions';
import sessionStore from './src/redux/sessionStore';
import {Provider} from 'react-redux';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  return (
    <Provider store={sessionStore}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false, animation: 'none'}}
          />
          <Stack.Screen
            name="Room"
            component={Room}
            options={{headerShown: false, animation: 'none'}}
          />
          <Stack.Screen
            name="AddSuggestions"
            component={AddSuggestions}
            options={{headerShown: false, animation: 'none'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
