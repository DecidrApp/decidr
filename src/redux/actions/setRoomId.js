export function setRoomId(id, code) {
  return {
    type: 'SET_ROOM_ID',
    payload: {
      room_id: id,
      room_code: code,
    },
  };
}
