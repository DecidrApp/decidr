import React from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';
import COLORS from '../../styles/colors';

const Button = ({text, onPress}) => (
  <TouchableHighlight
    onPress={onPress}
    style={styles.button}
    activeOpacity={0.95}
    underlayColor={COLORS.PRIMARY_LIGHT}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 32,
    color: COLORS.WHITE,
  },
});

export default Button;
