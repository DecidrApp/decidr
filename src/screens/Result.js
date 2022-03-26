import React, {useEffect} from 'react';
import {Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
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

  return (
    <SafeAreaView style={styles.background}>
      <Background />

      <Text style={styles.result}>{sessionStore.getState().winningVote}</Text>

      {showSkipButton()}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    paddingTop: '40%',
    paddingLeft: '12%',
    paddingRight: '12%',
    backgroundColor: COLORS.BACKGROUND,
  },
  result: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 64,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 20,
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
