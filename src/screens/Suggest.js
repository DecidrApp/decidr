import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import ToggleButton from '../components/ToggleButton';
import sessionStore from '../redux/sessionStore';
import {addSuggestions} from '../redux/actions/addSuggestions';
import {fetchData} from '../apis/SkipTheDishes';
import {API, graphqlOperation} from 'aws-amplify';
import {updateRoom} from '../graphql/mutations';
import Background from '../components/Background';

const Suggest = ({navigation, route}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [numSelected, setNumSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRestaurants = () => {
    const long = sessionStore.getState().longitude;
    const lat = sessionStore.getState().latitude;
    console.log(long, lat);
    if (sessionStore.getState().granted) {
      fetchData(lat, long).then(x => {
        // TODO: How many to render? Load on scroll?
        setRestaurants(x.slice(0, 10));
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  //TODO: I'm noticing some lag when selecting, seems to increase with # selected
  const suggestionSelected = name => {
    setNumSelected(numSelected + 1);
    setSelected([...selected, name]);
  };

  const suggestionDeselected = name => {
    setNumSelected(numSelected - 1);
    setSelected(selected.filter(item => item !== name));
  };

  const restaurantNameExists = name => {
    for (const restaurant of restaurants) {
      if (restaurant.name.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  return (
    <SafeAreaView style={[styles.background]}>
      <Background />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={[styles.title]}>{'Suggest'}</Text>

        <TextInput
          style={styles.input}
          onChangeText={setSearchTerm}
          value={searchTerm}
          textAlign={'left'}
          placeholder={'Search / Add Custom'}
          placeholderTextColor={COLORS.SECONDARY_LIGHT}
          autoCorrect={false}
        />

        {loading && <ActivityIndicator size={'large'} color={COLORS.WHITE} />}

        {searchTerm !== '' &&
          !customOptions.includes(searchTerm) &&
          !restaurantNameExists(searchTerm) && (
            <ToggleButton
              text={searchTerm}
              key={searchTerm}
              styleOverride={{marginBottom: 20}}
              onSelect={() => {
                setCustomOptions([...customOptions, searchTerm]);
                suggestionSelected(searchTerm);
              }}
              onDeselect={() => {
                suggestionDeselected(searchTerm);
              }}
            />
          )}

        {customOptions.map(option => {
          if (!option.toLowerCase().includes(searchTerm.toLowerCase())) {
            return null;
          }
          return (
            <ToggleButton
              text={option}
              key={option}
              onSelect={() => {
                suggestionSelected(option);
              }}
              onDeselect={() => {
                suggestionDeselected(option);
              }}
              alreadySelected={true}
            />
          );
        })}

        {restaurants.map(restaurant => {
          if (
            !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return null;
          }
          return (
            <ToggleButton
              text={restaurant.name}
              key={restaurant.id}
              onSelect={() => {
                suggestionSelected(restaurant.name);
              }}
              onDeselect={() => {
                suggestionDeselected(restaurant.name);
              }}
            />
          );
        })}

        <View
          style={{
            paddingTop: '55%',
          }}
        />
      </ScrollView>
      <View style={[styles.addContainer]}>
        <TextButton
          text={'Add ' + String(numSelected) + ' selected'}
          onPress={() => {
            sessionStore.dispatch(addSuggestions(selected));
            if (sessionStore.getState().room_id) {
              API.graphql(
                graphqlOperation(updateRoom, {
                  input: {
                    id: sessionStore.getState().room_id,
                    selected: sessionStore.getState().suggestions,
                  },
                }),
              );
            }
            sessionStore.dispatch(addSuggestions(selected));
            navigation.navigate('Room');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexGrow: 1,
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontFamily: 'LeagueGothic',
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: '10%',
    marginBottom: 20,
    color: COLORS.WHITE,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
    fontFamily: 'LeagueGothic',
    fontSize: 25,
    color: COLORS.BLACK,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
  },
  addContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5%',
  },
});

export default Suggest;
