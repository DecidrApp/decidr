import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../constants/colors';
import sessionStore from '../redux/sessionStore';
import {resetSuggestions} from '../redux/actions/resetSuggestions';
import {API, graphqlOperation} from 'aws-amplify';
import {onDeleteRoom, onUpdateRoom} from '../graphql/subscriptions';
import {
  closeAppSyncRoom,
  deleteAllBallots,
  removeRoomUser,
  updateRoomState,
  updateRoomUserState,
} from '../apis/AppSync';
import {resetRoom} from '../redux/actions/resetRoom';
import Background from '../components/Background';

const Result = ({navigation}) => {
  const [tallying, setTallying] = useState(true);

  function closeLeaveRoom() {
    // If user is the host, close the room
    removeRoomUser(sessionStore.getState().user_id);
    if (sessionStore.getState().isHost) {
      deleteAllBallots(sessionStore.getState().room_id);
      closeAppSyncRoom(sessionStore.getState().room_id);
    }

    sessionStore.dispatch(resetSuggestions());
    sessionStore.dispatch(resetRoom());
    navigation.navigate('Home');
  }

  useEffect(() => {
    // Disable going back for this screen
    // TODO: Uncomment this code when everything works
    // navigation.addListener('beforeRemove', e => {
    //   e.preventDefault();
    // });

    // Listen for host closing the voting period and closing room
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

    // Listen for host closing the voting period and returning to room
    const updateRoom = API.graphql(
      graphqlOperation(onUpdateRoom, {
        id: sessionStore.getState().room_id,
      }),
    ).subscribe({
      next: roomData => {
        if (roomData?.value?.data?.onUpdateRoom?.state === 'open') {
          updateRoomUserState(
            sessionStore.getState().user_id,
            'suggesting',
          ).then(() => {
            navigation.navigate('Room', {userState: 'suggesting'});
          });
        }
      },
      error: error => console.warn(error),
    });

    return () => {
      deleteSub.unsubscribe();
      updateRoom.unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    const sleep = ms => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    };

    let isMounted = true;
    sleep(1000).then(() => {
      if (!isMounted) {
        return;
      }
      setTallying(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  function showSkipButton() {
    const cleanUrl = sessionStore
      .getState()
      .suggestions.find(
        a => a.name === sessionStore.getState().winningVote,
      )?.cleanurl;

    if (cleanUrl) {
      return (
        <TextButton
          text="Open in SkipTheDishes ↗"
          onPress={() => {
            const urlToOpen = 'https://skipthedishes.com/' + cleanUrl;

            Linking.canOpenURL(urlToOpen).then(supported => {
              if (supported) {
                Linking.openURL(urlToOpen);
              } else {
                console.log("Don't know how to open URI: " + urlToOpen);
              }
            });
          }}
        />
      );
    }
  }

  const getWaitingText = () => {
    if (sessionStore.getState().winner_proportion === 0) {
      // Tied
      return 'Breaking a tie...';
    } else {
      return 'Tallying votes...';
    }
  };

  const getWinnerText = () => {
    if (sessionStore.getState().winner_proportion === 0) {
      // Tied
      return 'The tie-breaker is';
    } else {
      return 'The winning vote is';
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <Background />

      {tallying && <Text style={styles.waitingText}>{getWaitingText()}</Text>}
      {tallying && <ActivityIndicator size={'large'} color={COLORS.WHITE} />}

      {!tallying && <Text style={styles.winnerText}>{getWinnerText()}</Text>}
      {!tallying && (
        <Text style={styles.result}>{sessionStore.getState().winningVote}</Text>
      )}

      {!tallying && showSkipButton()}

      {!tallying && (
        <View style={styles.buttonContainer}>
          {sessionStore.getState().isHost && (
            <TextButton
              text={'Return all to Room'}
              styleOverride={{marginBottom: 10}}
              onPress={() => {
                updateRoomState(sessionStore.getState().room_id, 'open');
                deleteAllBallots(sessionStore.getState().room_id);
              }}
            />
          )}

          <TextButton
            text={sessionStore.getState().isHost ? 'Close Room' : 'Leave Room'}
            onPress={closeLeaveRoom}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    paddingTop: '15%',
    paddingLeft: '12%',
    paddingRight: '12%',
    backgroundColor: COLORS.BACKGROUND,
  },
  result: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 64,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 30,
    color: COLORS.WHITE,
  },
  waitingText: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 60,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 40,
    color: COLORS.WHITE,
  },
  winnerText: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 60,
    color: COLORS.WHITE,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5%',
    width: '100%',
  },
});

export default Result;
