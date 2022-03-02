import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import COLORS from '../styles/colors';

const Suggestion = ({text}) => (
  <View style={styles.suggestion}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  suggestion: {
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 32,
    color: COLORS.WHITE,
  },
});

export default Suggestion;
