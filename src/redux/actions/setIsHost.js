import {SET_IS_HOST} from '../types';

export function setIsHost(isHost) {
  return {
    type: SET_IS_HOST,
    payload: isHost,
  };
}
