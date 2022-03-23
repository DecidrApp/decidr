import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import Background from '../components/Background';

const TiedResult = ({navigation}) => {
  const [tieRunners] = useState(['Option 1', 'Option 2', 'Option 3']);

  useEffect(() => {
    // Disable going back for this screen
    // TODO: Uncomment this code when everything works
    // navigation.addListener('beforeRemove', e => {
    //   e.preventDefault();
    // });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.background}>
      <Background />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={styles.title}>Looks like there was a tie!</Text>

        {tieRunners.map((tie, index) => (
          <Text style={styles.tieText}>
            {tie}
            {index < tieRunners.length - 1 && (
              <Text style={styles.vsText}>{'\n'}Vs.</Text>
            )}
          </Text>
        ))}
        <View style={[{paddingTop: '50%'}]} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        {sessionStore.getState().isHost && (
          <TextButton
            text={'Spin the wheel'}
            styleOverride={{marginBottom: 10}}
            onPress={() => {}}
          />
        )}
        {!sessionStore.getState().isHost && (
          <TextButton
            text={'Waiting on host...'}
            styleOverride={{marginBottom: 10}}
            onPress={() => {}}
          />
        )}
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
  title: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 64,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.WHITE,
    paddingTop: '10%',
    marginBottom: 40,
  },
  tieText: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 52,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.WHITE,
  },
  vsText: {
    fontFamily: 'LeagueGothic-Regular',
    fontSize: 42,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.OFF_WHITE,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    bottom: '5%',
    width: '100%',
  },
});

export default TiedResult;
