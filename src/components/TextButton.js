import React from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';
import COLORS from '../styles/colors';

const TextButton = ({text, onPress, styleOverride = {}}) => (
  <TouchableHighlight
    onPress={onPress}
    style={[styles.button, styleOverride]}
    activeOpacity={0.95}
    underlayColor={COLORS.PRIMARY_LIGHT}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    borderColor: COLORS.PRIMARY_DARK,
    borderBottomWidth: 2,
  },
  buttonText: {
    fontSize: 40,
    fontFamily: 'LeagueGothic',
    color: COLORS.WHITE,
  },
});

export default TextButton;
