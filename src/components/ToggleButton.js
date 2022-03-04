import React, {useState} from 'react';
import {Text, TouchableHighlight, StyleSheet, View} from 'react-native';
import COLORS from '../styles/colors';

const ToggleButton = ({
  text,
  onSelect,
  onDeselect,
  alreadySelected = false,
}) => {
  const [isSelected, setIsSelected] = useState(alreadySelected);

  return (
    <TouchableHighlight
      onPress={() => {
        if (isSelected) {
          setIsSelected(false);
          onDeselect();
        } else {
          setIsSelected(true);
          onSelect();
        }
      }}
      style={styles.button}
      activeOpacity={0.95}
      underlayColor={COLORS.SECONDARY_LIGHT}>
      <View style={styles.container}>
        <Text
          style={styles.buttonText}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {text}
        </Text>
        <View style={styles.toggle}>
          {isSelected && <View style={styles.toggleOn} />}
        </View>
      </View>
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
    fontFamily: 'LeagueGothic',
    fontSize: 30,
    flex: 1,
    color: COLORS.WHITE,
    marginRight: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggle: {
    borderColor: COLORS.WHITE,
    borderWidth: 2,
    borderRadius: 5,
    width: 30,
    height: 30,
  },
  toggleOn: {
    backgroundColor: COLORS.WHITE,
    width: 20,
    height: 20,
    margin: 3,
  },
});

export default ToggleButton;
