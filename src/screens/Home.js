import React from 'react';
import {
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../components/atoms/Button';
import COLORS from '../styles/colors';
import {setLocation} from '../redux/actions/setLocation';
import {setIsHost} from '../redux/actions/setIsHost';
import sessionStore from '../redux/sessionStore';
import Geolocation from 'react-native-geolocation-service';
import {setRoomId} from '../redux/actions/setRoomId';
import {
  createAppSyncRoom,
  appSyncRoomExists,
  getAppSyncRoom,
} from '../apis/AppSync';
import {addSuggestions} from '../redux/actions/addSuggestions';

const Home = ({navigation}) => {
  const [roomCode, onChangeRoomCode] = React.useState('');

  //TODO: Move this code out of here, clean-up, and add more error-handling
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        sessionStore.dispatch(setLocation(true, long, lat));
      },
      error => {
        // See error code charts below.
        console.log('Error: ', error.code, error.message);
        console.error('Location is required');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization('whenInUse').then(r => {
      if (r !== 'granted') {
        console.warn('iOS location not granted');
        sessionStore.dispatch(setLocation(false, null, null));
      } else {
        getLocation();
      }
    });
  } else if (Platform.OS === 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Decidr Location Permission',
        message:
          'Decidr needs access to your location so nearby restaurants can be found.',
        buttonPositive: 'OK',
      },
    ).then(r => {
      if (r !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Android location not granted');
        sessionStore.dispatch(setLocation(false, null, null));
      } else {
        getLocation();
      }
    });
  } else {
    console.warn('Unable to get location due to unknown platform');
  }

  return (
    <SafeAreaView style={[styles.background]}>
      <View>
        <Text style={[styles.title]}>{'Decidr'}</Text>

        <Button
          text={'Host Room'}
          onPress={() => {
            createAppSyncRoom()
              .then(r => {
                sessionStore.dispatch(setRoomId(r.data.createRoom.id));
                sessionStore.dispatch(setIsHost(true));
                navigation.navigate('Room');
              })
              .catch(() => {
                Alert.alert(
                  'Unable to create room',
                  'Hmm something went wrong trying to create a room, please try again.',
                  [
                    {
                      text: 'Dismiss',
                      style: 'cancel',
                    },
                  ],
                );
                return;
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
        <Button
          text={'Join Room'}
          onPress={() => {
            if (roomCode === '') {
              Alert.alert(
                'Missing room code',
                'Please make sure you enter a room code.',
                [
                  {
                    text: 'Dismiss',
                    style: 'cancel',
                  },
                ],
              );
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
                Alert.alert(
                  'Unable to join room',
                  "Hmm we can't seem to find that room. Are you sure your code is correct?",
                  [
                    {
                      text: 'Dismiss',
                      style: 'cancel',
                    },
                  ],
                );
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
