import React, {useState} from 'react';
import {Text, TouchableHighlight, StyleSheet, View} from 'react-native';
import COLORS from '../styles/colors';

const VoteOptionButton = ({option, onPress, styleOverride = {}}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.button, styleOverride]}
      activeOpacity={0.95}
      underlayColor={COLORS.SECONDARY_LIGHT}>
      <Text
        style={styles.buttonText}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {option.name}
      </Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.SECONDARY_DARK,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 32,
    flex: 1,
    color: COLORS.WHITE,
    marginRight: 20,
  }
});

export default VoteOptionButton;
