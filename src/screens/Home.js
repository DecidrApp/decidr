import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import {setIsHost} from '../redux/actions/setIsHost';
import sessionStore from '../redux/sessionStore';
import {setRoomId} from '../redux/actions/setRoomId';
import {
  createAppSyncRoom,
  appSyncRoomExists,
  getAppSyncRoom,
  addRoomUser,
  getAllUsersForRoom,
} from '../apis/AppSync';
import {addSuggestions} from '../redux/actions/addSuggestions';
import requestLocation from '../apis/requestLocation';
import roomCreationFailureAlert from '../alerts/roomCreationFailureAlert';
import missingRoomCodeAlert from '../alerts/missingRoomCodeAlert';
import joinFailureAlert from '../alerts/joinFailureAlert';
import Background from '../components/Background';
import {setRoomUserId} from '../redux/actions/setRoomUserId';

const Home = ({navigation}) => {
  const [roomCode, setRoomCode] = React.useState('');

  requestLocation();

  function hostRoom() {
    createAppSyncRoom()
      .then(r => {
        addRoomUser(r.data.createRoom.id).then(r2 => {
          sessionStore.dispatch(setRoomUserId(r2));
          sessionStore.dispatch(setRoomId(r.data.createRoom.id));
          sessionStore.dispatch(setIsHost(true));
          navigation.navigate('Room', {
            initialParticipants: 1,
          });
        });
      })
      .catch(() => {
        roomCreationFailureAlert();
      });
  }

  function joinRoom() {
    if (roomCode === '') {
      missingRoomCodeAlert();
      return;
    }
    appSyncRoomExists(roomCode).then(r => {
      if (r) {
        getAppSyncRoom(roomCode).then(r2 => {
          addRoomUser(roomCode).then(r3 => {
            getAllUsersForRoom(roomCode).then(r4 => {
              sessionStore.dispatch(
                addSuggestions(r2?.data?.getRoom?.selected),
              );
              sessionStore.dispatch(setRoomUserId(r3));
              sessionStore.dispatch(setRoomId(roomCode));
              sessionStore.dispatch(setIsHost(false));
              navigation.navigate('Room', {
                initialParticipants: (r4 ?? []).length,
              });
            });
          });
        });
      } else {
        joinFailureAlert();
      }
    });
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}>
      <SafeAreaView style={styles.container}>
        <Background />
        <Text style={[styles.title]}>{'Decidr'}</Text>

        <TextButton text={'Host Room'} onPress={hostRoom} />
        <View style={styles.rowContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setRoomCode}
            value={roomCode}
            textAlign={'left'}
            placeholder={'Room Code'}
            placeholderTextColor={COLORS.SECONDARY_LIGHT}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
          <TextButton
            text={'Join Room'}
            styleOverride={{flex: 2}}
            onPress={joinRoom}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '20%',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  rowContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  title: {
    fontSize: 64,
    fontWeight: '600',
    fontFamily: 'LeagueGothic-Regular',
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.WHITE,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'lowercase',
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 25,
    color: COLORS.BLACK,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    marginRight: 5,
  },
});

export default Home;
