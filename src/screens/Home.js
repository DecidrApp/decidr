import React, {useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../components/atoms/Button';
import COLORS from '../styles/colors';
import {setLocation} from '../redux/actions/setLocation';
import {setIsHost} from '../redux/actions/setIsHost';
import sessionStore from '../redux/sessionStore';
import Geolocation from 'react-native-geolocation-service';
import {API, graphqlOperation} from 'aws-amplify';
import {createRoom} from '../graphql/mutations';
import {setRoomId} from '../redux/actions/setRoomId';
import {getRoom, getRoomByCode} from '../graphql/queries';

const Home = ({navigation}) => {
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

  const generateCode = () => {
    return Math.random()
      .toString(36)
      .replace(/[^a-z0-9]+/, '')
      .slice(0, 5);
  };

  async function createAppSyncRoom() {
    let code = generateCode();

    await API.graphql(graphqlOperation(getRoom, {id: code}))
      .then(r => {
        if (r?.data?.getRoom?.length > 0) {
          // Room already exists, try again
          code = generateCode();
        }
      })
      .catch(r => {
        console.log('ERROR: ' + r);
      });

    const newRoom = {
      code: code,
      id: code,
      state: 'open',
      selected: [],
    };

    return API.graphql(graphqlOperation(createRoom, {input: newRoom}));
  }

  return (
    <SafeAreaView style={[styles.background]}>
      <View>
        <Text style={[styles.title]}>{'Decidr'}</Text>

        <Button
          text={'Host Room'}
          onPress={() => {
            createAppSyncRoom().then(r => {
              sessionStore.dispatch(setRoomId(r.data.createRoom.id));
              sessionStore.dispatch(setIsHost(true));
              navigation.navigate('Room');
            });
          }}
        />
        <Button
          text={'Join Room'}
          onPress={() => {
            sessionStore.dispatch(setRoomId('0vixw'));
            sessionStore.dispatch(setIsHost(false));
            navigation.navigate('Room');
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
});

export default Home;
