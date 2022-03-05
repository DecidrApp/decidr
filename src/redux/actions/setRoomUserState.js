import {SET_ROOM_USER_STATE} from '../types';

export function setRoomUserState(state) {
  return {
    type: SET_ROOM_USER_STATE,
    payload: {
      user_state: state,
    },
  };
}
