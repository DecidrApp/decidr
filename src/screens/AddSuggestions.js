import React, {useState, Suspense, Fragment} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import Button from '../components/atoms/Button';
import COLORS from '../styles/colors';
import SuggestionButtons from '../components/molocules/SuggestionButtons';

const Room = ({navigation, route}) => {
  const [numSelected] = useState(0);

  return (
    <SafeAreaView style={[styles.background]}>
      <ScrollView>
        <Text style={[styles.title]}>{'Add Suggestions:'}</Text>

        {/*<SelectionButton text={'Indian'} />*/}
        <Suspense fallback={<div>Loading...</div>}>
          <SuggestionButtons />
        </Suspense>

        <Button
          text={'Add ' + String(numSelected) + ' selected'}
          onPress={() => {
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
    marginBottom: 5,
    color: COLORS.WHITE,
  },
});

export default Room;
