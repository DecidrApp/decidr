/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      selected
      state
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms(
    $filter: TableRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        selected
        state
      }
      nextToken
    }
  }
`;
export const getVote = /* GraphQL */ `
  query GetVote($id: ID!) {
    getVote(id: $id) {
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
export const listVotes = /* GraphQL */ `
  query ListVotes(
    $filter: TableVoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        order
      }
      nextToken
    }
  }
`;
