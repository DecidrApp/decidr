import React from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import {setIsHost} from '../redux/actions/setIsHost';
import sessionStore from '../redux/sessionStore';
import {setRoomId} from '../redux/actions/setRoomId';
import {
  createAppSyncRoom,
  appSyncRoomExists,
  getAppSyncRoom,
} from '../apis/AppSync';
import {addSuggestions} from '../redux/actions/addSuggestions';
import requestLocation from '../apis/requestLocation';
import roomCreationFailureAlert from '../alerts/roomCreationFailureAlert';
import missingRoomCodeAlert from '../alerts/missingRoomCodeAlert';
import joinFailureAlert from '../alerts/joinFailureAlert';

const Home = ({navigation}) => {
  const [roomCode, onChangeRoomCode] = React.useState('');

  requestLocation();

  return (
    <SafeAreaView style={[styles.background]}>
      <View>
        <Text style={[styles.title]}>{'Decidr'}</Text>

        <TextButton
          text={'Host Room'}
          onPress={() => {
            createAppSyncRoom()
              .then(r => {
                sessionStore.dispatch(setRoomId(r.data.createRoom.id));
                sessionStore.dispatch(setIsHost(true));
                navigation.navigate('Room');
              })
              .catch(() => {
                roomCreationFailureAlert();
              });
          }}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeRoomCode}
          value={roomCode}
          placeholder={'Room Code'}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
        <TextButton
          text={'Join Room'}
          onPress={() => {
            if (roomCode === '') {
              missingRoomCodeAlert();
              return;
            }
            appSyncRoomExists(roomCode).then(r => {
              if (r) {
                getAppSyncRoom(roomCode).then(r => {
                  sessionStore.dispatch(
                    addSuggestions(r?.data?.getRoom?.selected),
                  );
                  sessionStore.dispatch(setRoomId(roomCode));
                  sessionStore.dispatch(setIsHost(false));
                  navigation.navigate('Room');
                });
              } else {
                joinFailureAlert();
              }
            });
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
    paddingTop: '20%',
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 50,
    color: COLORS.WHITE,
  },
  input: {
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    textTransform: 'lowercase',
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
  },
});

export default Home;
