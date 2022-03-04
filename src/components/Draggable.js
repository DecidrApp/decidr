import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import COLORS from '../styles/colors';

const Draggable = ({item, index, drag, isActive}) => {
  return (
    <View style={[styles.container]}>
      <Text style={[styles.indexText]}>{String(index + 1)}.</Text>
      <TouchableHighlight
        style={[
          styles.touchable,
          {
            backgroundColor: isActive
              ? COLORS.SECONDARY_DARK
              : COLORS.SECONDARY,
          },
        ]}
        onLongPress={drag}
        activationDistance={0}
        underlayColor={COLORS.SECONDARY_LIGHT}
        activeOpacity={0.95}>
        <Text style={[styles.text]} numberOfLines={1} ellipsizeMode={'tail'}>
          {item.label}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexText: {
    fontFamily: 'LeagueGothic',
    fontSize: 32,
    marginTop: -17,
    marginRight: 10,
    color: COLORS.WHITE,
  },
  touchable: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    flexGrow: 1,
  },
  text: {
    fontFamily: 'LeagueGothic',
    fontSize: 32,
    color: COLORS.WHITE,
    flex: 1,
    textAlign: 'left',
    marginRight: 30,
  },
});

export default Draggable;
