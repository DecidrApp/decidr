/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRoom = /* GraphQL */ `
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      id
      selected
      state
    }
  }
`;
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom($input: UpdateRoomInput!) {
    updateRoom(input: $input) {
      id
      selected
      state
    }
  }
`;
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom($input: DeleteRoomInput!) {
    deleteRoom(input: $input) {
      id
      selected
      state
    }
  }
`;
export const createVote = /* GraphQL */ `
  mutation CreateVote($input: CreateVoteInput!) {
    createVote(input: $input) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
export const updateVote = /* GraphQL */ `
  mutation UpdateVote($input: UpdateVoteInput!) {
    updateVote(input: $input) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
export const deleteVote = /* GraphQL */ `
  mutation DeleteVote($input: DeleteVoteInput!) {
    deleteVote(input: $input) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
