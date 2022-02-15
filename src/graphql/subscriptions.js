/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom(
    $id: ID
    $code: String
    $selected: [String]
    $state: String
  ) {
    onCreateRoom(id: $id, code: $code, selected: $selected, state: $state) {
      id
      code
      selected
      state
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom(
    $id: ID
    $code: String
    $selected: [String]
    $state: String
  ) {
    onUpdateRoom(id: $id, code: $code, selected: $selected, state: $state) {
      id
      code
      selected
      state
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom(
    $id: ID
    $code: String
    $selected: [String]
    $state: String
  ) {
    onDeleteRoom(id: $id, code: $code, selected: $selected, state: $state) {
      id
      code
      selected
      state
    }
  }
`;
