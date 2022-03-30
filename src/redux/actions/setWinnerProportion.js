import {SET_WINNER_PROPORTION} from '../types';

export function setWinnerProportion(proportion) {
  return {
    type: SET_WINNER_PROPORTION,
    payload: proportion,
  };
}
