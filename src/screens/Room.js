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
import {
  closeAppSyncRoom,
  deleteAllBallots,
  removeRoomUser,
} from '../apis/AppSync';
import Background from '../components/Background';

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

  function closeRoom() {
    // If user is the host, close the room
    removeRoomUser(sessionStore.getState().user_id);
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
      next: roomData => {
        // TODO: There should probably be some more checking here to prevent
        //       race conditions.
        if (roomData?.value?.data?.onUpdateRoom?.selected) {
          setSuggestions(roomData?.value?.data?.onUpdateRoom?.selected);
          sessionStore.dispatch(
            addSuggestions(roomData?.value?.data?.onUpdateRoom?.selected),
          );
        }
      },
      error: error => console.warn(error),
    });

    return () => {
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <Background />

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
        <View style={[styles.rowContainer]}>
          <TextButton
            text={'Suggest'}
            styleOverride={{flex: 1, marginRight: 5}}
            onPress={() => {
              navigation.navigate('Suggest');
            }}
          />

          <TextButton
            text={'Vote'}
            styleOverride={{flex: 1, marginLeft: 5}}
            onPress={() => {
              navigation.navigate('Vote');
            }}
          />
        </View>

        <TextButton
          text={sessionStore.getState().isHost ? 'Close Room' : 'Leave Room'}
          onPress={closeRoom}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  roomCode: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: '5%',
    color: COLORS.WHITE,
  },
  participants: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 50,
    color: COLORS.WHITE,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    bottom: '5%',
    width: '100%',
  },
  rowContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
});

export default Room;
