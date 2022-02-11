import {ADD_SUGGESTIONS} from '../types';

export function addSuggestions(suggestions) {
  return {
    type: ADD_SUGGESTIONS,
    payload: suggestions,
  };
}
