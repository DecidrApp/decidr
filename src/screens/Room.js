import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import TextButton from '../components/TextButton';
import Suggestion from '../components/Suggestion';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {useIsFocused} from '@react-navigation/native';
import {resetSuggestions} from '../redux/actions/resetSuggestions';
import {API, graphqlOperation} from 'aws-amplify';
import {
  onCreateRoomUser,
  onDeleteRoom,
  onUpdateRoom,
} from '../graphql/subscriptions';
import {addSuggestions} from '../redux/actions/addSuggestions';
import {resetRoom} from '../redux/actions/resetRoom';
import {
  closeAppSyncRoom,
  deleteAllBallots,
  getAllUsersForRoom,
  getAppSyncRoom,
  removeRoomUser,
  updateRoomUserState,
} from '../apis/AppSync';
import Background from '../components/Background';

const Room = ({navigation}) => {
  // Setup States
  const [roomCode, setRoomCode] = useState('?????');
  const [userId, setUserId] = useState('');
  const [userState, setUserState] = useState('suggesting');
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const isFocused = useIsFocused(); // Force re-render

  // Calculate number of participants
  function numParticipants() {
    return users.length;
  }

  // ON LOAD
  useEffect(() => {
    // Save room code into local state
    if (sessionStore.getState().room_id) {
      setRoomCode(sessionStore.getState().room_id);
    }

    // Save user id into local state
    if (sessionStore.getState().user_id) {
      setUserId(sessionStore.getState().user_id);
    }

    // Fetch existing suggestions and users
    getAppSyncRoom(roomCode)
      .then(r => {
        const selected = r?.data?.getRoom?.selected;
        setSuggestions(selected ?? []);
        sessionStore.dispatch(addSuggestions(selected ?? []));
        return getAllUsersForRoom(roomCode);
      })
      .then(r => {
        setUsers(r ?? []);
      });
  }, [roomCode]);

  function closeLeaveRoom() {
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

  // SETUP SUBSCRIPTIONS (WILL RUN ONCE)
  useEffect(() => {
    // On Room Updated
    const updateRoomSub = API.graphql(
      graphqlOperation(onUpdateRoom, {id: sessionStore.getState().room_id}),
    ).subscribe({
      next: data => {
        // Update selections with value in the DB
        const selected = data?.value?.data?.onUpdateRoom?.selected;
        setSuggestions(selected ?? []);
        sessionStore.dispatch(addSuggestions(selected ?? []));

        // If the state of the room changes to voting, update user state and
        // transition.
        const roomState = data?.value?.data?.onUpdateRoom?.state;
        if (roomState === 'voting') {
          updateRoomUserState(userId, 'voting');
          navigation.navigate('Vote');
        }
      },
      error: error => console.warn(error),
    });

    // On a new user joining the room
    const newUserSub = API.graphql(
      graphqlOperation(onCreateRoomUser, {
        room_id: sessionStore.getState().room_id,
      }),
    ).subscribe({
      next: r => {
        console.log('new user joined');
        console.log(r);
      },
      error: error => console.warn(error),
    });

    // On room deletion by host
    const deleteSub = API.graphql(
      graphqlOperation(onDeleteRoom, {id: sessionStore.getState().room_id}),
    ).subscribe({
      next: () => {
        removeRoomUser(sessionStore.getState().user_id);
        sessionStore.dispatch(resetSuggestions());
        sessionStore.dispatch(resetRoom());
        navigation.navigate('Home');
      },
      error: error => console.warn(error),
    });

    return () => {
      updateRoomSub.unsubscribe();
      newUserSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [roomCode, navigation, userId]);

  return (
    <SafeAreaView style={[styles.container]}>
      <Background />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={[styles.roomCode]}>{'Room Code: ' + roomCode}</Text>
        <Text style={[styles.participants]}>
          {String(numParticipants()) + ' participants'}
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
            text={userState === 'suggesting' ? 'Ready' : 'Unready'}
            styleOverride={{flex: 1, marginLeft: 5}}
            onPress={() => {
              if (userState === 'suggesting') {
                updateRoomUserState(userId, 'ready');
                setUserState('ready');
              } else {
                updateRoomUserState(userId, 'suggesting');
                setUserState('suggesting');
              }
            }}
          />
        </View>

        <TextButton
          text={sessionStore.getState().isHost ? 'Close Room' : 'Leave Room'}
          onPress={closeLeaveRoom}
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
