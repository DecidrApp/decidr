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
  onDeleteRoomUser,
  onUpdateRoom,
  onUpdateRoomUser,
} from '../graphql/subscriptions';
import {addSuggestions} from '../redux/actions/addSuggestions';
import {resetRoom} from '../redux/actions/resetRoom';
import {
  closeAppSyncRoom,
  deleteAllBallots,
  getAllUsersForRoom,
  removeRoomUser,
  updateRoomState,
  updateRoomUserState,
} from '../apis/AppSync';
import Background from '../components/Background';
import PersonIcon from '../assets/images/person.svg';
import ActivityIndicatorButton from '../components/ActivityIndicatorButton';

const Room = ({route, navigation}) => {
  // Setup States
  const [roomCode] = useState(sessionStore.getState().room_id);
  const [userState, setUserState] = useState(
    route.params?.userState ?? 'suggesting',
  );
  const [userId] = useState(sessionStore.getState().user_id);
  const [suggestions, setSuggestions] = useState(
    sessionStore.getState().suggestions ?? [],
  );
  const [numParticipants, setNumParticipants] = useState(
    route.params?.initialParticipants ?? 1,
  );
  const [numReady, setNumReady] = useState(0);
  const [readyLoading, setReadyLoading] = useState(false);
  const isFocused = useIsFocused(); // Force re-render

  function closeLeaveRoom() {
    // If user is the host, close the room
    removeRoomUser(sessionStore.getState().user_id).then(() => {
      if (sessionStore.getState().isHost) {
        deleteAllBallots(roomCode);
        closeAppSyncRoom(roomCode);
      }
      sessionStore.dispatch(resetSuggestions());
      sessionStore.dispatch(resetRoom());
      navigation.navigate('Home');
    });
  }

  useEffect(() => {
    if (isFocused) {
      setUserState(route.params?.userState ?? 'suggesting');
    }
  }, [isFocused, route.params?.userState]);

  // SETUP SUBSCRIPTIONS
  useEffect(() => {
    // Helper function for when users join or leave
    const updateUsers = () => {
      getAllUsersForRoom(roomCode).then(r => {
        setReadyLoading(false);
        const users = r ?? [];
        setNumParticipants(users.length);
        setNumReady(users.filter(a => a.state === 'ready').length);
        if (
          sessionStore.getState().isHost &&
          !users.some(a => a?.state !== 'ready')
        ) {
          // All users are ready
          updateRoomState(roomCode, 'voting');
        }
      });
    };

    // On Room Updated
    const updateRoomSub = API.graphql(
      graphqlOperation(onUpdateRoom, {id: sessionStore.getState().room_id}),
    ).subscribe({
      next: data => {
        // Update selections with value in the DB
        const selected = data?.value?.data?.onUpdateRoom?.selected;
        setSuggestions(selected ?? []);
        sessionStore.dispatch(resetSuggestions());
        sessionStore.dispatch(addSuggestions(selected ?? []));

        // If the state of the room changes to voting, update user state and
        // transition.
        const roomState = data?.value?.data?.onUpdateRoom?.state;
        if (roomState === 'voting') {
          updateRoomUserState(userId, 'voting');
          navigation.navigate('Vote', {page: 1});
        }
      },
      error: error => console.warn(error),
    });

    // On a new user joining the room
    const newUserSub = API.graphql(
      graphqlOperation(onCreateRoomUser, {
        room_id: roomCode,
      }),
    ).subscribe({
      next: updateUsers,
      error: error => console.warn(error),
    });

    // On a user leaving the room
    const deleteUserSub = API.graphql(
      graphqlOperation(onDeleteRoomUser, {
        room_id: roomCode,
      }),
    ).subscribe({
      next: updateUsers,
      error: error => console.warn(error),
    });

    // On a user updating their state
    const updateUserSub = API.graphql(
      graphqlOperation(onUpdateRoomUser, {
        room_id: roomCode,
      }),
    ).subscribe({
      next: updateUsers,
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
      deleteUserSub.unsubscribe();
      updateUserSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [roomCode, navigation, userId]);

  const createPeopleIcons = (total, ready) => {
    let icons = [];
    for (let i = 0; i < total; i++) {
      icons.push(
        <PersonIcon
          stroke={i < total - ready ? COLORS.WHITE : COLORS.READY}
          key={'person-' + i}
          fillOpacity={0}
          width={40}
          height={40}
        />,
      );
    }
    return icons.reverse();
  };

  const readyButton = () => {
    if (!readyLoading) {
      return (
        <TextButton
          text={userState === 'suggesting' ? 'Ready' : 'Unready'}
          styleOverride={{flex: 1, marginLeft: 5}}
          onPress={() => {
            setReadyLoading(true);
            if (userState === 'suggesting') {
              setNumReady(numReady + 1);
              updateRoomUserState(userId, 'ready');
              setUserState('ready');
            } else {
              setNumReady(numReady - 1);
              updateRoomUserState(userId, 'suggesting');
              setUserState('suggesting');
            }
          }}
        />
      );
    } else {
      return (
        <ActivityIndicatorButton styleOverride={{flex: 1, marginLeft: 5}} />
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Background />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={[styles.header]}>
          <View style={[styles.headerRoomInfo]}>
            <Text style={[styles.roomCodeTitle]}>{'ROOM CODE'}</Text>
            <Text style={[styles.roomCode]}>{roomCode}</Text>
          </View>
          {/*<Text style={[styles.participants]}>*/}
          {/*  {String(numParticipants) + ' participants'}*/}
          {/*</Text>*/}
          <View style={[styles.headerParticipants]}>
            {createPeopleIcons(numParticipants, numReady)}
          </View>
        </View>

        {suggestions.map(suggestion => (
          <Suggestion text={suggestion?.name} key={suggestion?.name} />
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

          {readyButton()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  headerRoomInfo: {
    flexDirection: 'column',
  },
  headerParticipants: {
    flexGrow: 1,
    marginTop: 18,
    marginRight: 6,
    maxWidth: '60%',
    flexDirection: 'row',
    alignContent: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  roomCodeTitle: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'left',
    paddingTop: '5%',
    marginBottom: -10,
    marginLeft: 12,
    color: COLORS.OFF_WHITE,
  },
  roomCode: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 60,
    fontWeight: '600',
    textAlign: 'left',
    paddingTop: '5%',
    marginLeft: 12,
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
