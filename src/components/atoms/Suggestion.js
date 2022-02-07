import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import COLORS from '../../styles/colors';

const Suggestion = ({text, suggestedBy}) => (
  <View style={styles.suggestion}>
    <Text style={styles.text}>{text}</Text>
    <Text style={styles.suggestedBy}>{'Suggested by ' + suggestedBy}</Text>
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
  suggestedBy: {
  },
});

export default Suggestion;
