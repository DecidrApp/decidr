import {StyleSheet, Text, View} from 'react-native';
import COLORS from '../constants/colors';
import React from 'react';

const Tag = ({text, color = COLORS.PRIMARY_LIGHT}) => (
  <View style={[styles.container, {backgroundColor: color}]}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  text: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 20,
    color: COLORS.WHITE,
  },
});

export default Tag;
