/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom($id: ID, $selected: [String], $state: String) {
    onCreateRoom(id: $id, selected: $selected, state: $state) {
      id
      selected {
        name
        cleanurl
      }
      state
      winner
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom($id: ID) {
    onUpdateRoom(id: $id) {
      id
      selected {
        name
        cleanurl
      }
      state
      winner
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom($id: ID) {
    onDeleteRoom(id: $id) {
      id
      selected {
        name
        cleanurl
      }
      state
      winner
    }
  }
`;
export const onCreateVote = /* GraphQL */ `
  subscription OnCreateVote($room_id: String) {
    onCreateVote(room_id: $room_id) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
export const onUpdateVote = /* GraphQL */ `
  subscription OnUpdateVote($id: ID, $room_id: String, $ranking: [String]) {
    onUpdateVote(id: $id, room_id: $room_id, ranking: $ranking) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
export const onDeleteVote = /* GraphQL */ `
  subscription OnDeleteVote($id: ID, $room_id: String, $ranking: [String]) {
    onDeleteVote(id: $id, room_id: $room_id, ranking: $ranking) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
export const onCreateRoomUser = /* GraphQL */ `
  subscription OnCreateRoomUser($room_id: String) {
    onCreateRoomUser(room_id: $room_id) {
      id
      room_id
      state
    }
  }
`;
export const onUpdateRoomUser = /* GraphQL */ `
  subscription OnUpdateRoomUser($room_id: String) {
    onUpdateRoomUser(room_id: $room_id) {
      id
      room_id
      state
    }
  }
`;
export const onDeleteRoomUser = /* GraphQL */ `
  subscription OnDeleteRoomUser($room_id: String) {
    onDeleteRoomUser(room_id: $room_id) {
      id
      room_id
      state
    }
  }
`;
