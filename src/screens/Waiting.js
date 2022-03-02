import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {API, graphqlOperation} from 'aws-amplify';
import {onCreateVote, onUpdateRoom} from '../graphql/subscriptions';
import {
  getAllBallots,
  updateRoomState,
  updateRoomWinner,
} from '../apis/AppSync';
import {calculateRanking} from '../apis/Voting';
import {setWinningVote} from '../redux/actions/setWinningVote';

const Waiting = ({navigation, route}) => {
  // TODO: Hosts votes are only calculated once another vote comes into the DB
  const [votes, setVotes] = useState([]);

  function onVoteCreate() {
    getAllBallots(sessionStore.getState().room_id).then(voteData => {
      console.log(voteData?.data?.getVotesForRoom?.items);
      if (voteData?.data?.getVotesForRoom?.items) {
        setVotes(voteData?.data?.getVotesForRoom?.items);
      }
    });
  }

  function onRoomUpdate(roomData) {
    if (roomData?.value?.data?.onUpdateRoom?.state === 'result') {
      sessionStore.dispatch(
        setWinningVote(roomData?.value?.data?.onUpdateRoom?.winner),
      );
      navigation.navigate('Result');
    }
  }

  useEffect(() => {
    // Listen for new votes
    const updateSub = API.graphql(
      graphqlOperation(onCreateVote, {
        room_id: sessionStore.getState().room_id,
      }),
    ).subscribe({
      next: onVoteCreate,
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
      updateSub.unsubscribe();
      updateRoom.unsubscribe();
    };
  });

  const closeButton = () => {
    if (sessionStore.getState().isHost) {
      return (
        <TextButton
          text={'Close Voting'}
          onPress={() => {
            const result = calculateRanking(
              sessionStore.getState().suggestions,
              votes.map(v => v.ranking),
            );
            updateRoomWinner(sessionStore.getState().room_id, result[0]).then(
              () => {
                updateRoomState(sessionStore.getState().room_id, 'result');
              },
            );
            sessionStore.dispatch(setWinningVote(result[0]));
          }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={[styles.background]}>
      <Text>Waiting</Text>
      {closeButton()}
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
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: '10%',
    marginBottom: 20,
    color: COLORS.WHITE,
  },
  addContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5%',
  },
});

export default Waiting;
