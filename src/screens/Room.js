import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Button from '../components/atoms/Button';
import Suggestion from '../components/atoms/Suggestion';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {useIsFocused} from '@react-navigation/native';
import {resetSuggestions} from '../redux/actions/resetSuggestions';
import {API, graphqlOperation} from 'aws-amplify';
import {deleteRoom} from '../graphql/mutations';
import {onUpdateRoom} from '../graphql/subscriptions';
import {addSuggestions} from '../redux/actions/addSuggestions';
import { resetRoom } from "../redux/actions/resetRoom";

const Room = ({navigation}) => {
  const [roomCode, setRoomCode] = useState('?????');
  const [numParticipants] = useState(1);
  const isFocused = useIsFocused(); // Force re-render

  const subscription = API.graphql(
    graphqlOperation(onUpdateRoom, {id: sessionStore.getState().room_id}),
  ).subscribe({
    next: roomData => {
      // TODO: There should probably be some more checking here to prevent
      //       race conditions.
      if (roomData?.value?.data?.onUpdateRoom?.selected) {
        resetSuggestions();
        addSuggestions(roomData?.value?.data?.onUpdateRoom?.selected);
      }
    },
    error: error => console.error(error),
  });

  useEffect(() => {
    // Get room code from redux for display
    if (sessionStore.getState().room_id) {
      setRoomCode(sessionStore.getState().room_id);
    }
  }, []);

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

        <View style={[{paddingTop: '70%'}]} />
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
            subscription.unsubscribe();

            // If user is the host, close the room
            if (sessionStore.getState().isHost) {
              API.graphql(
                graphqlOperation(deleteRoom, {
                  input: {id: roomCode},
                }),
              ).catch(() => {
                console.warn('Unable to delete room');
              });
            }

            sessionStore.dispatch(resetSuggestions());
            sessionStore.dispatch(resetRoom());
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
