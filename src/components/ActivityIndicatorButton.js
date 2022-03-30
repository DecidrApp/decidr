import React from 'react';
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../constants/colors';

const TextButton = ({onPress, styleOverride = {}}) => (
  <TouchableHighlight
    onPress={onPress}
    style={[styles.button, styleOverride]}
    activeOpacity={0.95}
    underlayColor={COLORS.PRIMARY_LIGHT}>
    <Text style={styles.buttonText}>
      <ActivityIndicator size={'large'} color={COLORS.WHITE} />
    </Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderBottomWidth: 8,
  },
  buttonText: {
    marginTop: 6,
    fontSize: 32,
    fontFamily: 'LeagueGothic-Regular',
    color: COLORS.WHITE,
  },
});

export default TextButton;
