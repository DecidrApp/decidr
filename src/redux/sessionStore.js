import {createStore} from 'redux';
import {
  ADD_SUGGESTIONS,
  RESET_SUGGESTIONS,
  SET_IS_HOST,
  SET_LOCATION,
  SET_ROOM_ID,
  SET_WINNING_VOTE,
  RESET_ROOM,
  SET_ROOM_USER_ID,
  SET_ROOM_USER_STATE,
  SET_BALLOT,
  SET_WINNER_PROPORTION,
} from './types';

const initialState = {
  isHost: false,
  winningVote: '',
  winner_proportion: 0, // 0 for tied, >0 for proportion of votes
  suggestions: [],
  ballot: [],
  location_granted: false,
  longitude: 0.0,
  latitude: 0.0,
  room_id: null,
  user_id: null,
  user_state: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_HOST:
      return {
        ...state,
        isHost: action.payload,
      };
    case SET_LOCATION:
      return {
        ...state,
        location_granted: action.payload.location_granted,
        longitude: action.payload.longitude,
        latitude: action.payload.latitude,
      };
    case SET_WINNING_VOTE:
      return {
        ...state,
        winningVote: action.payload,
      };
    case SET_ROOM_ID:
      return {
        ...state,
        room_id: action.payload.room_id,
      };
    case ADD_SUGGESTIONS:
      const newSuggestions = state.suggestions;
      action.payload.forEach(suggestion => {
        if (!newSuggestions.includes(suggestion)) {
          newSuggestions.push(suggestion);
        }
      });
      return {
        ...state,
        suggestions: newSuggestions,
      };
    case RESET_SUGGESTIONS:
      return {
        ...state,
        suggestions: [],
      };
    case RESET_ROOM:
      return {
        ...state,
        room_id: null,
        user_id: null,
        user_state: null,
      };
    case SET_ROOM_USER_ID:
      return {
        ...state,
        user_id: action.payload.user_id,
      };
    case SET_ROOM_USER_STATE:
      return {
        ...state,
        user_state: action.payload.user_state,
      };
    case SET_BALLOT:
      return {
        ...state,
        ballot: action.payload.slice(),
      };
    case SET_WINNER_PROPORTION:
      return {
        ...state,
        winner_proportion: action.payload,
      };
    default:
      return state;
  }
};

export default createStore(reducer);
