/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom($id: ID, $selected: [String], $state: String) {
    onCreateRoom(id: $id, selected: $selected, state: $state) {
      id
      selected
      state
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom($id: ID) {
    onUpdateRoom(id: $id) {
      id
      selected
      state
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom($id: ID) {
    onDeleteRoom(id: $id) {
      id
      selected
      state
    }
  }
`;
export const onCreateVote = /* GraphQL */ `
  subscription OnCreateVote($room_id: String) {
    onCreateVote(room_id: $room_id) {
      id
      room_id {
        id
        selected
        state
      }
      order
    }
  }
`;
export const onUpdateVote = /* GraphQL */ `
  subscription OnUpdateVote($id: ID, $room_id: String, $order: [String]) {
    onUpdateVote(id: $id, room_id: $room_id, order: $order) {
      id
      room_id {
        id
        selected
        state
      }
      order
    }
  }
`;
export const onDeleteVote = /* GraphQL */ `
  subscription OnDeleteVote($id: ID, $room_id: String, $order: [String]) {
    onDeleteVote(id: $id, room_id: $room_id, order: $order) {
      id
      room_id {
        id
        selected
        state
      }
      order
    }
  }
`;
