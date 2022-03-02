import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import TextButton from '../components/TextButton';
import Suggestion from '../components/Suggestion';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {useIsFocused} from '@react-navigation/native';
import {resetSuggestions} from '../redux/actions/resetSuggestions';
import {API, graphqlOperation} from 'aws-amplify';
import {onDeleteRoom, onUpdateRoom} from '../graphql/subscriptions';
import {addSuggestions} from '../redux/actions/addSuggestions';
import {resetRoom} from '../redux/actions/resetRoom';
import {closeAppSyncRoom, deleteAllBallots} from '../apis/AppSync';

const Room = ({navigation}) => {
  const [roomCode, setRoomCode] = useState('?????');
  const [suggestions, setSuggestions] = useState(
    sessionStore.getState().suggestions,
  );
  const [numParticipants] = useState(1);
  const isFocused = useIsFocused(); // Force re-render

  function onRoomUpdate(roomData) {
    // TODO: There should probably be some more checking here to prevent
    //       race conditions.
    if (roomData?.value?.data?.onUpdateRoom?.selected) {
      // Updates are coming through, but screen is not re-rendering
      setSuggestions(roomData?.value?.data?.onUpdateRoom?.selected);
      sessionStore.dispatch(
        addSuggestions(roomData?.value?.data?.onUpdateRoom?.selected),
      );
    }
  }

  // TODO: This might need to be fixed/wrapped in another function
  function closeRoom() {
    // If user is the host, close the room
    if (sessionStore.getState().isHost) {
      deleteAllBallots(roomCode);
      closeAppSyncRoom(roomCode);
    }

    sessionStore.dispatch(resetSuggestions());
    sessionStore.dispatch(resetRoom());
    navigation.navigate('Home');
  }

  useEffect(() => {
    // Get room code from redux for display
    if (sessionStore.getState().room_id) {
      setRoomCode(sessionStore.getState().room_id);
    }

    const updateSub = API.graphql(
      graphqlOperation(onUpdateRoom, {id: sessionStore.getState().room_id}),
    ).subscribe({
      next: onRoomUpdate,
      error: error => console.warn(error),
    });

    const deleteSub = API.graphql(
      graphqlOperation(onDeleteRoom, {id: sessionStore.getState().room_id}),
    ).subscribe({
      next: closeRoom,
      error: error => console.warn(error),
    });

    return () => {
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [closeRoom]);

  return (
    <SafeAreaView style={[styles.background]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={[styles.roomCode]}>{'Room Code: ' + roomCode}</Text>
        <Text style={[styles.participants]}>
          {String(numParticipants) + ' participants'}
        </Text>

        {suggestions.map(suggestion => (
          <Suggestion text={suggestion} key={suggestion} />
        ))}

        <View style={[{paddingTop: '70%'}]} />
      </ScrollView>

      <View style={[styles.buttonContainer]}>
        <TextButton
          text={'Add Suggestion'}
          onPress={() => {
            navigation.navigate('Suggest');
          }}
        />

        <TextButton
          text={'Vote'}
          onPress={() => {
            navigation.navigate('Vote');
          }}
        />

        <TextButton
          text={sessionStore.getState().isHost ? 'Close Room' : 'Leave Room'}
          onPress={closeRoom}
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
