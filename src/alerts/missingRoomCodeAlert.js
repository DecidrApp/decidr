import {Alert} from 'react-native';

const missingRoomCodeAlert = () => {
  Alert.alert('Missing room code', 'Please make sure you enter a room code.', [
    {
      text: 'Dismiss',
      style: 'cancel',
    },
  ]);
};

export default missingRoomCodeAlert;
