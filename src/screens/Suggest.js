import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import Button from '../components/atoms/Button';
import COLORS from '../styles/colors';
import SelectionButton from '../components/atoms/SelectionButton';
import sessionStore from '../redux/sessionStore';
import {addSuggestions} from '../redux/actions/addSuggestions';
import {connect} from 'react-redux';
import {setIsHost} from '../redux/actions/setIsHost';

const Suggest = ({navigation, route}) => {
  const restaurants = ['Indian', 'Thai', 'Pizza', 'Subway'];
  const [selected, setSelected] = useState([]);
  const [numSelected, setNumSelected] = useState(0);

  const suggestionSelected = name => {
    setNumSelected(numSelected + 1);
    setSelected(selected => [...selected, name]);
  };

  const suggestionDeselected = name => {
    setNumSelected(numSelected - 1);
    setSelected(selected.filter(item => item !== name));
  };

  return (
    <SafeAreaView style={[styles.background]}>
      <ScrollView>
        <Text style={[styles.title]}>{'Add Suggestions:'}</Text>

        {restaurants.map(restaurant => (
          <SelectionButton
            text={restaurant}
            key={restaurant}
            onSelect={() => {
              suggestionSelected(restaurant);
            }}
            onDeselect={() => {
              suggestionDeselected(restaurant);
            }}
          />
        ))}

        <Button
          text={'Add ' + String(numSelected) + ' selected'}
          onPress={() => {
            sessionStore.dispatch(addSuggestions(selected));
            navigation.navigate('Room');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexGrow: 10,
    paddingTop: '10%',
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.WHITE,
  },
});

export default Suggest;
