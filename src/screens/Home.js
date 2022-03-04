import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
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
} from '../apis/AppSync';
import {addSuggestions} from '../redux/actions/addSuggestions';
import requestLocation from '../apis/requestLocation';
import roomCreationFailureAlert from '../alerts/roomCreationFailureAlert';
import missingRoomCodeAlert from '../alerts/missingRoomCodeAlert';
import joinFailureAlert from '../alerts/joinFailureAlert';

const Home = ({navigation}) => {
  const [roomCode, setRoomCode] = React.useState('');

  requestLocation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../assets/images/escheresque_ste.png')}
          resizeMode="repeat"
          style={styles.background}
        />
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
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  rowContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  title: {
    fontSize: 64,
    fontWeight: '600',
    fontFamily: 'LeagueGothic',
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.WHITE,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'lowercase',
    fontFamily: 'LeagueGothic',
    fontSize: 25,
    color: COLORS.BLACK,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    marginRight: 5,
  },
});

export default Home;
