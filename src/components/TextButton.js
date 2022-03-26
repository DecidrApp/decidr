import React, {useState} from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';
import COLORS from '../styles/colors';

const TextButton = ({text, onPress, styleOverride = {}}) => {
  const [isBeingHeld, setIsBeingHeld] = useState(false);

  return (
    <TouchableHighlight
      onPress={onPress}
      style={[
        styles.button,
        isBeingHeld ? styles.held : styles.notHeld,
        styleOverride,
      ]}

      activeOpacity={0.95}
      onShowUnderlay={() => setIsBeingHeld(true)}
      onHideUnderlay={() => setIsBeingHeld(false)}
      underlayColor={COLORS.PRIMARY_DARK}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
  },
  notHeld: {
    borderBottomWidth: 8,
  },
  held: {
    borderTopWidth: 8,
  },
  buttonText: {
    fontSize: 32,
    fontFamily: 'LeagueGothic-Regular',
    color: COLORS.WHITE,
  },
});

export default TextButton;
