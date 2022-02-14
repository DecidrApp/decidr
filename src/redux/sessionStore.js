import {createStore} from 'redux';
import {
  ADD_SUGGESTIONS,
  RESET_SUGGESTIONS,
  SET_IS_HOST,
  SET_LOCATION,
} from './types';

const initialState = {
  isHost: false,
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
    default:
      return state;
  }
};

export default createStore(reducer);
