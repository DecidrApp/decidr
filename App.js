import React from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.background,
        {
          backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        },
      ]}>
      <View>
        <Text
          style={[
            styles.title,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {'Decidr'}
        </Text>

        <TouchableHighlight onPress={() => {}} style={styles.button} activeOpacity={0.6} underlayColor={'#00AA00'}>
          <Text
            style={[
              styles.buttonText,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            {'Host Room'}
          </Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => {}} style={styles.button} activeOpacity={0.6} underlayColor={'#00AA00'}>
          <Text
            style={[
              styles.buttonText,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            {'Join Room'}
          </Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexGrow: 10,
    paddingTop: 150,
    paddingLeft: 50,
    paddingRight: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#8e208e',
    padding: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 32,
  },
});

export default App;
