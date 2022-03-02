import {Alert} from 'react-native';

const joinFailureAlert = () => {
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
};

export default joinFailureAlert;
