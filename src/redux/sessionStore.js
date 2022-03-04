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
} from './types';

const initialState = {
  isHost: false,
  winningVote: '',
  suggestions: [],
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
        granted: action.payload.granted,
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
      };
    case SET_ROOM_USER_ID:
      return {
        ...state,
        user_id: action.payload.user_id,
      };
    default:
      return state;
  }
};

export default createStore(reducer);
