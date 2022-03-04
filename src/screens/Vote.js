import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import TextButton from '../components/TextButton';
import COLORS from '../styles/colors';
import sessionStore from '../redux/sessionStore';
import DraggableFlatList from 'react-native-draggable-flatlist/src/components/DraggableFlatList';
import Draggable from '../components/Draggable';
import {submitBallot} from '../apis/AppSync';
import Background from '../components/Background';

const Vote = ({navigation}) => {
  const listData = sessionStore.getState().suggestions.map(suggestion => {
    return {
      key: suggestion,
      label: suggestion,
    };
  });

  const [options, setOptions] = useState(listData);

  return (
    <SafeAreaView style={[styles.background]}>
      <Background />

      <DraggableFlatList
        data={options}
        onDragEnd={({data}) => {
          setOptions(data);
        }}
        keyExtractor={item => item.key}
        renderItem={Draggable}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <Text style={[styles.title]}>Vote</Text>}
        ListFooterComponent={() => <View style={[{paddingTop: '40%'}]} />}
      />
      <View style={[styles.voteContainer]}>
        <TextButton
          text={'Vote'}
          onPress={() => {
            let ballot = [];
            for (let i = 0; i < options.length; i++) {
              ballot.push({name: options[i].key, rank: i + 1});
            }

            submitBallot(sessionStore.getState().room_id, ballot).then(r => {
              // TODO: Save ballot ID to prevent duplicate submission
              navigation.navigate('Waiting');
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
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    paddingTop: '5%',
    fontFamily: 'LeagueGothic',
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.WHITE,
  },
  voteContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5%',
    width: '100%',
  },
});

export default Vote;
