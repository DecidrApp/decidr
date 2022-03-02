import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {resetSuggestions} from '../redux/actions/resetSuggestions';
import {API, graphqlOperation} from 'aws-amplify';
import {onDeleteRoom, onUpdateRoom} from '../graphql/subscriptions';
import {
  closeAppSyncRoom,
  deleteAllBallots,
  updateRoomState,
} from '../apis/AppSync';
import {resetRoom} from '../redux/actions/resetRoom';

const Result = ({navigation}) => {
  function closeRoom() {
    // If user is the host, close the room
    if (sessionStore.getState().isHost) {
      deleteAllBallots(sessionStore.getState().room_id);
      closeAppSyncRoom(sessionStore.getState().room_id);
    }

    sessionStore.dispatch(resetSuggestions());
    sessionStore.dispatch(resetRoom());
    navigation.navigate('Home');
  }

  function onRoomUpdate(roomData) {
    if (roomData?.value?.data?.onUpdateRoom?.state === 'open') {
      navigation.navigate('Room');
    }
  }

  useEffect(() => {
    const deleteSub = API.graphql(
      graphqlOperation(onDeleteRoom, {id: sessionStore.getState().room_id}),
    ).subscribe({
      next: () => {
        sessionStore.dispatch(resetSuggestions());
        sessionStore.dispatch(resetRoom());
        navigation.navigate('Home');
      },
      error: error => console.warn(error),
    });

    // Listen for host closing the voting period
    const updateRoom = API.graphql(
      graphqlOperation(onUpdateRoom, {
        id: sessionStore.getState().room_id,
      }),
    ).subscribe({
      next: onRoomUpdate,
      error: error => console.warn(error),
    });

    return () => {
      deleteSub.unsubscribe();
      updateRoom.unsubscribe();
    };
  });

  return (
    <SafeAreaView style={[styles.background]}>
      <Text style={[styles.result]}>{sessionStore.getState().winningVote}</Text>

      <TextButton
        text={'Return to Room'}
        onPress={() => {
          if (sessionStore.getState().isHost) {
            updateRoomState(sessionStore.getState().room_id, 'open');
            deleteAllBallots(sessionStore.getState().room_id);
          }
          navigation.navigate('Room');
        }}
      />

      <TextButton
        text={sessionStore.getState().isHost ? 'Close Room' : 'Leave Room'}
        onPress={closeRoom}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    paddingTop: '40%',
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  result: {
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '90%',
    color: COLORS.WHITE,
  },
});

export default Result;
