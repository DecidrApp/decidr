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
  updateRoomState,
  updateRoomWinner,
} from '../apis/AppSync';
import {setWinningVote} from '../redux/actions/setWinningVote';
import Background from '../components/Background';
import {calculateRanking} from '../apis/VotingV2';

const Waiting = ({navigation, route}) => {
  const [roomCode] = useState(sessionStore.getState().room_id);
  const [userId] = useState(sessionStore.getState().user_id);
  const [totalUsers, setTotalUsers] = useState(
    (route.params?.initialUsers ?? []).length,
  );
  const [votedUsers, setVotedUsers] = useState(
    (route.params?.initialVotes ?? []).length,
  );

  // SETUP SUBSCRIPTIONS
  useEffect(() => {
    // Disable going back while waiting
    // TODO: Uncomment this code when everything works
    // navigation.addListener('beforeRemove', e => {
    //   e.preventDefault();
    // });

    // Helper function for when users update their state
    const updateUsers = () => {
      getAllUsersForRoom(roomCode).then(r => {
        getAllBallots(roomCode).then(r2 => {
          const ballots = r2.data.getVotesForRoom.items.map(a => a.ranking);
          const users = r ?? [];
          setTotalUsers(users.length);
          setVotedUsers(users.filter(a => a?.state === 'voted').length);
          if (
            sessionStore.getState().isHost &&
            !users.some(a => a?.state !== 'voted')
          ) {
            const winner = calculateRanking(
              sessionStore.getState().suggestions.map(a => a.name),
              ballots,
            );

            // All users are ready
            updateRoomWinner(roomCode, winner).then(() => {
              updateRoomState(roomCode, 'result');
            });
          }
        });
      });
    };

    // Call it once to if the host is the last vote
    if (sessionStore.getState().isHost) {
      updateUsers();
    }

    const voteCreationSub = API.graphql(
      graphqlOperation(onCreateVote, {
        room_id: sessionStore.getState().room_id,
      }),
    ).subscribe({
      next: updateUsers,
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
          const res = winner.split('*');
          if (res[0] === 'W') {
            // res[1] => winner name
            // res[2] => winner votes / total ballots cast
            sessionStore.dispatch(setWinningVote(res[1]));
            // TODO: Send proportion as well
          } else if (res[0] === 'T') {
            // res[1 ... n] => tied names
            // TODO: Send to random selection
          }

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
