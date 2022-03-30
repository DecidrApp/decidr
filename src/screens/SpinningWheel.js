import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import COLORS from '../styles/colors';
import Background from '../components/Background';

const SpinningWheel = ({navigation}) => {
  const [options] = useState(['Option 1', 'Option 2']);
  const [spinIndex, setSpinIndex] = useState(0);
  const [numOfTicks, setNumOfTicks] = useState(0);
  const [visibleOptions, setVisibleOptions] = useState([
    'Option 1',
    'Option 2',
    'Option 3',
  ]);
  const MIN_NUM_OF_TICKS = 11;
  const WINNER = 'Option 1';

  const sleep = ms => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

  useEffect(() => {
    setNumOfTicks(0);
  }, []);

  useEffect(() => {
    let isMounted = true;
    sleep(100).then(() => {
      if (!isMounted) {
        return;
      }

      if (
        numOfTicks < MIN_NUM_OF_TICKS ||
        options[(spinIndex + 2) % options.length] !== WINNER
      ) {
        setNumOfTicks(numOfTicks + 1);
      }
      setSpinIndex(numOfTicks % options.length);
    });
    return () => {
      isMounted = false;
    };
  }, [numOfTicks, options.length]);

  useEffect(() => {
    let upperClamp = Math.min(visibleOptions.length, options.length);
    let beforeIndex = spinIndex - 1 < 0 ? upperClamp - 1 : spinIndex - 1;
    let afterIndex = (spinIndex + 1) % upperClamp;
    setVisibleOptions([
      options[beforeIndex],
      options[spinIndex],
      options[afterIndex],
    ]);
  }, [options, spinIndex, visibleOptions.length]);

  return (
    <SafeAreaView style={styles.background}>
      <Background />

      <View style={styles.container}>
        <Text
          style={styles.secondaryWheelText}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {visibleOptions[0]}
        </Text>
        <View style={{paddingTop: '1%', backgroundColor: COLORS.WHITE}} />
        <Text style={styles.wheelText} numberOfLines={1} ellipsizeMode={'tail'}>
          {visibleOptions[1]}
        </Text>
        <View style={{paddingTop: '1%', backgroundColor: COLORS.WHITE}} />
        <Text
          style={styles.secondaryWheelText}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {visibleOptions[2]}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    paddingTop: '70%',
  },
  title: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 64,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.WHITE,
    paddingTop: '10%',
    marginBottom: 40,
  },
  wheelText: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 52,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.WHITE,
    marginBottom: 7,
  },
  secondaryWheelText: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 42,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.OFF_WHITE,
    marginBottom: 5,
  },
});

export default SpinningWheel;
