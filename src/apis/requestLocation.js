import Geolocation from 'react-native-geolocation-service';
import sessionStore from '../redux/sessionStore';
import {setLocation} from '../redux/actions/setLocation';
import {PermissionsAndroid, Platform} from 'react-native';

//TODO: Better error-handling

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

const requestLocation = () => {
  if (Platform.OS === 'ios') {
    requestIOSLocation();
  } else if (Platform.OS === 'android') {
    requestAndroidLocation();
  } else {
    console.warn('Unable to get location due to unknown platform');
  }
};

const requestIOSLocation = () => {
  Geolocation.requestAuthorization('whenInUse').then(r => {
    if (r !== 'granted') {
      console.warn('iOS location not granted');
      sessionStore.dispatch(setLocation(false, null, null));
    } else {
      getLocation();
    }
  });
};

const requestAndroidLocation = () => {
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
};

export default requestLocation;
