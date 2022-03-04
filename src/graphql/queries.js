/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      selected
      state
      winner
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
        winner
      }
      nextToken
    }
  }
`;
export const getVote = /* GraphQL */ `
  query GetVote($id: ID!) {
    getVote(id: $id) {
      id
      room_id
      ranking {
        name
        rank
      }
    }
  }
`;
export const getVotesForRoom = /* GraphQL */ `
  query GetVotesForRoom($room_id: String!) {
    getVotesForRoom(room_id: $room_id) {
      items {
        id
        room_id
        ranking {
          name
          rank
        }
      }
      nextToken
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
        room_id
      }
      nextToken
    }
  }
`;
export const getRoomUser = /* GraphQL */ `
  query GetRoomUser($id: ID!) {
    getRoomUser(id: $id) {
      id
      room_id
      state
    }
  }
`;
export const listRoomUsers = /* GraphQL */ `
  query ListRoomUsers(
    $filter: TableRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoomUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        room_id
        state
      }
      nextToken
    }
  }
`;
export const queryRoomUsersByRoomIdIndex = /* GraphQL */ `
  query QueryRoomUsersByRoomIdIndex(
    $room_id: String!
    $first: Int
    $after: String
  ) {
    queryRoomUsersByRoomIdIndex(
      room_id: $room_id
      first: $first
      after: $after
    ) {
      items {
        id
        room_id
        state
      }
      nextToken
    }
  }
`;
