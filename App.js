import React from 'react';
import type {Node} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './src/screens/Home';
import Room from './src/screens/Room';
import Suggest from './src/screens/Suggest';
import sessionStore from './src/redux/sessionStore';
import {Provider} from 'react-redux';
import Vote from './src/screens/Vote';
import Result from './src/screens/Result';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import Waiting from './src/screens/Waiting';
Amplify.configure(awsmobile);

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  return (
    <GestureHandlerRootView style={[{flex: 1}]}>
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
              name="Suggest"
              component={Suggest}
              options={{headerShown: false, animation: 'none'}}
            />
            <Stack.Screen
              name="Vote"
              component={Vote}
              options={{headerShown: false, animation: 'none'}}
            />
            <Stack.Screen
              name="Vote2"
              component={Vote}
              options={{headerShown: false, animation: 'none'}}
            />
            <Stack.Screen
              name="Vote3"
              component={Vote}
              options={{headerShown: false, animation: 'none'}}
            />
            <Stack.Screen
              name="Waiting"
              component={Waiting}
              options={{headerShown: false, animation: 'none'}}
            />
            <Stack.Screen
              name="Result"
              component={Result}
              options={{headerShown: false, animation: 'none'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
