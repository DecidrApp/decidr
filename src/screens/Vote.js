import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import {
  getAllBallots,
  getAllUsersForRoom,
  submitBallot,
  updateRoomUserState,
} from '../apis/AppSync';
import Background from '../components/Background';
import VoteOptionButton from '../components/VoteOptionButton';
import {setBallot} from '../redux/actions/setBallot';

const Vote = ({route, navigation}) => {
  const [userId] = useState(sessionStore.getState().user_id);

  const {page} = route.params;
  const NUM_OF_PAGES = 3;

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      sessionStore.dispatch(
        setBallot(sessionStore.getState().ballot.slice(0, -1)),
      );
    });
  }, [navigation]);

  const submit = () => {
    const ballot = sessionStore.getState().ballot;

    submitBallot(sessionStore.getState().room_id, ballot).then(() => {
      updateRoomUserState(userId, 'voted').then(() => {
        getAllBallots(sessionStore.getState().room_id).then(r3 => {
          getAllUsersForRoom(sessionStore.getState().room_id).then(r4 => {
            const items = r3?.data?.getVotesForRoom?.items;
            // TODO: Save ballot ID to prevent duplicate submission
            navigation.navigate('Waiting', {
              initialVotes: items ?? [],
              initialUsers: r4 ?? [],
            });
          });
        });
      });
    });
  };

  return (
    <SafeAreaView style={[styles.background]}>
      <Background />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={[styles.title]}>Vote for your #{page}</Text>

        {sessionStore.getState().suggestions.map(option => {
          for (const entry of sessionStore.getState().ballot) {
            if (option.name === entry.name) {
              return;
            }
          }

          return (
            <VoteOptionButton
              option={option}
              key={option.name}
              onPress={() => {
                sessionStore.dispatch(
                  setBallot([
                    ...sessionStore.getState().ballot,
                    {name: option.name, rank: page},
                  ]),
                );
                if (
                  page === NUM_OF_PAGES ||
                  page === sessionStore.getState().suggestions.length
                ) {
                  submit();
                  sessionStore.dispatch(setBallot([]));
                  navigation.navigate('Waiting');
                } else {
                  navigation.push('Vote', {
                    page: page + 1,
                  });
                }
              }}
            />
          );
        })}
      </ScrollView>

      <View style={[styles.voteContainer]}>
        <TextButton
          text={'No Preference'}
          onPress={() => {
            submit();
            sessionStore.dispatch(setBallot([]));
            navigation.navigate('Waiting');
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
  title: {
    paddingTop: '5%',
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.WHITE,
  },
  voteContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5%',
    width: '100%',
  },
});

export default Vote;
