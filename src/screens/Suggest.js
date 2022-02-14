import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import Button from '../components/atoms/Button';
import COLORS from '../styles/colors';
import SelectionButton from '../components/atoms/SelectionButton';
import sessionStore from '../redux/sessionStore';
import {addSuggestions} from '../redux/actions/addSuggestions';
import {connect} from 'react-redux';
import {setIsHost} from '../redux/actions/setIsHost';
import {fetchData} from '../apis/SkipTheDishes';

const Suggest = ({navigation, route}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState([]);
  const [numSelected, setNumSelected] = useState(0);

  const fetchRestaurants = () => {
    const long = sessionStore.getState().longitude;
    const lat = sessionStore.getState().latitude;
    console.log(long, lat);
    if (sessionStore.getState().granted) {
      fetchData(lat, long).then(x => {
        // TODO: How many to render? Load on scroll?
        // TODO: I think this might be causing a memory leak
        setRestaurants(x.slice(0, 5));
      });
    }
  };
  fetchRestaurants();

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
            text={restaurant.name}
            key={restaurant.id}
            onSelect={() => {
              suggestionSelected(restaurant.name);
            }}
            onDeselect={() => {
              suggestionDeselected(restaurant.name);
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
