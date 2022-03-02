import {Alert} from 'react-native';

const roomCreationFailureAlert = () => {
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
};

export default roomCreationFailureAlert;
