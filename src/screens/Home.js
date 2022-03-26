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
import ActivityIndicatorButton from '../components/ActivityIndicatorButton';

const Home = ({navigation}) => {
  const [roomCode, setRoomCode] = React.useState('');
  const [joiningRoom, setJoiningRoom] = React.useState(false);
  const [hostingRoom, setHostingRoom] = React.useState(false);

  requestLocation();

  function hostRoom() {
    setHostingRoom(true);
    createAppSyncRoom()
      .then(r => {
        addRoomUser(r.data.createRoom.id).then(r2 => {
          setHostingRoom(false);
          sessionStore.dispatch(setRoomUserId(r2));
          sessionStore.dispatch(setRoomId(r.data.createRoom.id));
          sessionStore.dispatch(setIsHost(true));
          navigation.navigate('Room', {
            initialParticipants: 1,
          });
        });
      })
      .catch(() => {
        setHostingRoom(false);
        roomCreationFailureAlert();
      });
  }

  function joinRoom() {
    setJoiningRoom(true);
    if (roomCode === '') {
      setJoiningRoom(false);
      missingRoomCodeAlert();
      return;
    }
    appSyncRoomExists(roomCode).then(r => {
      if (r) {
        getAppSyncRoom(roomCode).then(r2 => {
          addRoomUser(roomCode).then(r3 => {
            getAllUsersForRoom(roomCode).then(r4 => {
              setJoiningRoom(false);
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
        setJoiningRoom(false);
        joinFailureAlert();
      }
    });
  }

  const hostButton = () => {
    if (hostingRoom) {
      return <ActivityIndicatorButton />;
    } else {
      return <TextButton text={'Host Room'} onPress={hostRoom} />;
    }
  };

  const joinButton = () => {
    if (joiningRoom) {
      return <ActivityIndicatorButton styleOverride={{flex: 2}} />;
    } else {
      return (
        <TextButton
          text={'Join Room'}
          styleOverride={{flex: 2}}
          onPress={joinRoom}
        />
      );
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}>
      <SafeAreaView style={styles.container}>
        <Background />
        <Text style={[styles.title]}>{'decidr'}</Text>

        {hostButton()}
        <View style={styles.rowContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setRoomCode}
            value={roomCode}
            textAlign={'left'}
            placeholder={'> Room Code'}
            placeholderTextColor={COLORS.OFF_WHITE}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
          {joinButton()}
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
    fontSize: 100,
    fontWeight: '600',
    fontFamily: 'LondrinaOutline-Regular',
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.WHITE,
  },
  input: {
    flex: 1.5,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'lowercase',
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 28,
    color: COLORS.WHITE,
    borderRadius: 8,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    backgroundColor: COLORS.PRIMARY,
    marginRight: 5,
  },
});

export default Home;
