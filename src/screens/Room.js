import React, {useState} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from '../components/atoms/Button';
import Suggestion from '../components/atoms/Suggestion';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {useIsFocused} from '@react-navigation/native';
import {resetSuggestions} from '../redux/actions/resetSuggestions';

const Room = ({navigation}) => {
  const [roomCode] = useState('x9z6y');
  const [numParticipants] = useState(1);
  const isFocused = useIsFocused(); // Force re-render

  return (
    <SafeAreaView style={[styles.background]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={[styles.roomCode]}>{'Room Code: ' + roomCode}</Text>
        <Text style={[styles.participants]}>
          {String(numParticipants) + ' participants'}
        </Text>

        {sessionStore.getState().suggestions.map(suggestion => (
          <Suggestion text={suggestion} key={suggestion} />
        ))}

        <View style={[{paddingTop: '70%'}]}/>
      </ScrollView>

      <View style={[styles.buttonContainer]}>
        <Button
          text={'Add Suggestion'}
          onPress={() => {
            navigation.navigate('Suggest');
          }}
        />

        <Button
          text={'Vote'}
          onPress={() => {
            navigation.navigate('Vote');
          }}
        />

        <Button
          text={sessionStore.getState().isHost ? 'Close Room' : 'Leave Room'}
          onPress={() => {
            sessionStore.dispatch(resetSuggestions());
            navigation.navigate('Home');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexGrow: 10,
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  roomCode: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    paddingTop: '10%',
    color: COLORS.WHITE,
  },
  participants: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
    color: COLORS.WHITE,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '0%',
    width: '100%',
  },
});

export default Room;
