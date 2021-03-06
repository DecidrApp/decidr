import {Dimensions} from 'react-native';
import COLORS from '../constants/colors';

const {ImageBackground, StyleSheet} = require('react-native');
const React = require('react');

const Background = () => (
  <ImageBackground
    source={require('../assets/images/wallpaper.png')}
    resizeMode="repeat"
    style={styles.background}
  />
);

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    backgroundColor: COLORS.BACKGROUND,
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Background;
