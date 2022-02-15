import {SET_WINNING_VOTE} from '../types';

export function setWinningVote(winner) {
  return {
    type: SET_WINNING_VOTE,
    payload: winner,
  };
}
