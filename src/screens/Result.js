import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {resetSuggestions} from '../redux/actions/resetSuggestions';

const Result = ({navigation}) => {
  return (
    <SafeAreaView style={[styles.background]}>
      <Text style={[styles.result]}>{sessionStore.getState().winningVote}</Text>

      <TextButton
        text={'Return to Room'}
        onPress={() => {
          navigation.navigate('Room');
        }}
      />

      <TextButton
        text={sessionStore.getState().isHost ? 'Close Room' : 'Leave Room'}
        onPress={() => {
          sessionStore.dispatch(resetSuggestions());
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    paddingTop: '40%',
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  result: {
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '90%',
    color: COLORS.WHITE,
  },
});

export default Result;
