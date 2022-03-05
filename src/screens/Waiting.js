import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {API, graphqlOperation} from 'aws-amplify';
import {
  onCreateRoomUser,
  onCreateVote,
  onDeleteRoomUser,
  onUpdateRoom,
  onUpdateRoomUser,
} from '../graphql/subscriptions';
import {
  getAllBallots,
  getAllUsersForRoom,
  updateRoomWinner,
} from '../apis/AppSync';
import {setWinningVote} from '../redux/actions/setWinningVote';
import Background from '../components/Background';

const Waiting = ({navigation, route}) => {
  const [votes, setVotes] = useState([]);
  const [roomCode] = useState(sessionStore.getState().room_id);
  const [userId] = useState(sessionStore.getState().user_id);
  const [totalUsers, setTotalUsers] = useState(0);
  const [votedUsers, setVotedUsers] = useState(0);

  // ON LOAD (WILL ONLY RUN ONCE)
  useEffect(() => {
    // Fetch potential existing votes
    getAllBallots(sessionStore.getState().room_id).then(voteData => {
      const items = voteData?.data?.getVotesForRoom?.items;
      setVotes(items ?? []);
    });
  }, []);

  // SETUP SUBSCRIPTIONS
  useEffect(() => {
    // Helper function for when users update their state
    const updateUsers = () => {
      getAllUsersForRoom(roomCode).then(r => {
        const users = r ?? [];
        setTotalUsers(users.length);
        setVotedUsers(users.filter(a => a?.state === 'voted').length);
        if (
          sessionStore.getState().isHost &&
          !users.some(a => a?.state !== 'voted')
        ) {
          // TODO: Calculate result
          // All users are ready
          updateRoomWinner(roomCode, 'Some winner');
        }
      });
    };

    const voteCreationSub = API.graphql(
      graphqlOperation(onCreateVote, {
        room_id: sessionStore.getState().room_id,
      }),
    ).subscribe({
      next: () => {
        getAllBallots(sessionStore.getState().room_id).then(voteData => {
          const items = voteData?.data?.getVotesForRoom?.items;
          setVotes(items ?? []);
        });
      },
      error: error => console.warn(error),
    });

    // On Room Updated
    const updateRoomSub = API.graphql(
      graphqlOperation(onUpdateRoom, {id: sessionStore.getState().room_id}),
    ).subscribe({
      next: data => {
        // If the state of the room changes to result, transition.
        const roomState = data?.value?.data?.onUpdateRoom?.state;
        const winner = data?.value?.data?.onUpdateRoom?.winner;
        if (roomState === 'result') {
          sessionStore.dispatch(setWinningVote(winner));
          navigation.navigate('Result');
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

    return () => {
      updateRoomSub.unsubscribe();
      newUserSub.unsubscribe();
      deleteUserSub.unsubscribe();
      updateUserSub.unsubscribe();
      voteCreationSub.unsubscribe();
    };
  }, [roomCode, navigation, userId]);

  return (
    <SafeAreaView style={[styles.background]}>
      <Background />

      <Text style={styles.title}>Waiting for votes to come in!</Text>
      <Text style={styles.title}>
        {votedUsers} of {totalUsers} voted
      </Text>
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
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 52,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: '30%',
    marginBottom: 20,
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
});

export default Waiting;
