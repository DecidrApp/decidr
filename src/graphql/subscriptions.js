/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom(
    $id: ID
    $owner_hash: String
    $selected: [String]
    $state: String
  ) {
    onCreateRoom(
      id: $id
      owner_hash: $owner_hash
      selected: $selected
      state: $state
    ) {
      id
      owner_hash
      selected
      state
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom($id: ID) {
    onUpdateRoom(id: $id) {
      id
      owner_hash
      selected
      state
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom($id: ID) {
    onDeleteRoom(id: $id) {
      id
      owner_hash
      selected
      state
    }
  }
`;
export const onCreateVote = /* GraphQL */ `
  subscription OnCreateVote($id: ID, $room_id: String, $order: [String]) {
    onCreateVote(id: $id, room_id: $room_id, order: $order) {
      id
      room_id {
        id
        owner_hash
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
        owner_hash
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
        owner_hash
        selected
        state
      }
      order
    }
  }
`;
