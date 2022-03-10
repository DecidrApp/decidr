import {SET_ROOM_USER_ID} from '../types';

export function setRoomUserId(id) {
  return {
    type: SET_ROOM_USER_ID,
    payload: {
      user_id: id,
    },
  };
}
