import {SET_BALLOT} from '../types';

export function setBallot(ballot) {
  return {
    type: SET_BALLOT,
    payload: ballot,
  };
}
