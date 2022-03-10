/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRoom = /* GraphQL */ `
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      id
      selected
      state
      winner
    }
  }
`;
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom($input: UpdateRoomInput!) {
    updateRoom(input: $input) {
      id
      selected
      state
      winner
    }
  }
`;
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom($input: DeleteRoomInput!) {
    deleteRoom(input: $input) {
      id
      selected
      state
      winner
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
export const deleteVotes = /* GraphQL */ `
  mutation DeleteVotes($input: DeleteVotesInput!) {
    deleteVotes(input: $input) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
export const createRoomUser = /* GraphQL */ `
  mutation CreateRoomUser($input: CreateRoomUserInput!) {
    createRoomUser(input: $input) {
      id
      room_id
      state
    }
  }
`;
export const updateRoomUser = /* GraphQL */ `
  mutation UpdateRoomUser($input: UpdateRoomUserInput!) {
    updateRoomUser(input: $input) {
      id
      room_id
      state
    }
  }
`;
export const deleteRoomUser = /* GraphQL */ `
  mutation DeleteRoomUser($input: DeleteRoomUserInput!) {
    deleteRoomUser(input: $input) {
      id
      room_id
      state
    }
  }
`;
