import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import Button from '../components/atoms/Button';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {resetSuggestions} from '../redux/actions/resetSuggestions';

const Result = ({navigation}) => {
  return (
    <SafeAreaView style={[styles.background]}>
      <Text style={[styles.result]}>{'RESULT'}</Text>

      <Button
        text={'Return to Room'}
        onPress={() => {
          navigation.navigate('Room');
        }}
      />
      
      <Button
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
