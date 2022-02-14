import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import Button from '../components/atoms/Button';
import Suggestion from '../components/atoms/Suggestion';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';

const Vote = ({navigation}) => {
  const options = sessionStore.getState().suggestions;

  return (
    <SafeAreaView style={[styles.background]}>
      <ScrollView>
        <Text style={[styles.title]}>{'Vote: '}</Text>

        {sessionStore.getState().suggestions.map(suggestion => (
          <Suggestion
            text={suggestion}
            key={suggestion}
          />
        ))}

        <Button text={'Vote'} onPress={() => {
          navigation.navigate('Result');
        }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexGrow: 10,
    paddingTop: '10%',
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    color: COLORS.WHITE,
  },
});

export default Vote;
