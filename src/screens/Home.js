import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Button from '../components/atoms/Button';
import COLORS from '../styles/colors';
import {setLocation} from '../redux/actions/setLocation';
import {setIsHost} from '../redux/actions/setIsHost';
import sessionStore from '../redux/sessionStore';
import Geolocation from 'react-native-geolocation-service';

const Home = ({navigation}) => {
  Geolocation.requestAuthorization('whenInUse').then(r => {
    if (r !== 'granted') {
      console.warn('iOS location not granted');
      sessionStore.dispatch(setLocation(false, null, null));
    } else {
      Geolocation.getCurrentPosition(
        position => {
          const long = position.coords.longitude;
          const lat = position.coords.latitude;
          sessionStore.dispatch(setLocation(true, long, lat));
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          console.error('Location is required');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  });

  return (
    <SafeAreaView style={[styles.background]}>
      <View>
        <Text style={[styles.title]}>{'Decidr'}</Text>

        <Button
          text={'Host Room'}
          onPress={() => {
            sessionStore.dispatch(setIsHost(true));
            navigation.navigate('Room');
          }}
        />
        <Button
          text={'Join Room'}
          onPress={() => {
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
