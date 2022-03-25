import {API, graphqlOperation} from 'aws-amplify';
import {
  getRoom,
  getVotesForRoom,
  queryRoomUsersByRoomIdIndex,
} from '../graphql/queries';
import {
  createRoom,
  createVote,
  deleteVotes,
  deleteRoom,
  updateRoom,
  createRoomUser,
  deleteRoomUser,
  updateRoomUser,
} from '../graphql/mutations';

// ------------------------------------------------
// ---------------- HELPER FUNCTIONS --------------
// ------------------------------------------------

function generateCode() {
  return Math.random()
    .toString(10)
    .replace(/[^A-HJ-NP-Za-hj-np-z2-9]+/, '')
    .slice(0, 3)
    .toUpperCase();
}

// ------------------------------------------------
// ---------------- USER OPERATIONS ---------------
// ------------------------------------------------

async function getAllUsersForRoom(code) {
  return await API.graphql(
    graphqlOperation(queryRoomUsersByRoomIdIndex, {
      room_id: code,
    }),
  )
    .then(r => {
      return r?.data?.queryRoomUsersByRoomIdIndex?.items;
    })
    .catch(r => {
      console.info(r);
      console.warn('Unable to fetch all room users in room ' + code);
      return [];
    });
}

async function addRoomUser(code) {
  return API.graphql(
    graphqlOperation(createRoomUser, {
      input: {
        room_id: code,
        state: 'suggesting',
      },
    }),
  )
    .then(r => {
      return r?.data?.createRoomUser?.id;
    })
    .catch(r => {
      console.info(r);
      console.warn('Unable to create room user in room ' + code);
      return false;
    });
}

function removeRoomUser(user_id) {
  return API.graphql(
    graphqlOperation(deleteRoomUser, {
      input: {
        id: user_id,
      },
    }),
  ).catch(r => {
    console.info(r);
    console.warn('Unable to remove room user ' + user_id);
    return false;
  });
}

function updateRoomUserState(user_id, state) {
  return API.graphql(
    graphqlOperation(updateRoomUser, {
      input: {id: user_id, state: state},
    }),
  ).catch(r => {
    console.info(r);
    console.warn(
      'Unable to update room user ' + user_id + 'with state ' + state,
    );
  });
}

// ------------------------------------------------
// ---------------- ROOM OPERATIONS ---------------
// ------------------------------------------------

async function appSyncRoomExists(code) {
  return API.graphql(graphqlOperation(getRoom, {id: code}))
    .then(r => {
      return !!r?.data?.getRoom;
    })
    .catch(() => {
      return false;
    });
}

async function getAppSyncRoom(code) {
  return API.graphql(graphqlOperation(getRoom, {id: code})).catch(() => {
    return null;
  });
}

async function createAppSyncRoom() {
  let code = generateCode();

  await appSyncRoomExists(code).then(r => {
    if (r) {
      code = generateCode();
    }
  });

  const newRoom = {
    id: code,
    state: 'open',
    selected: [],
  };

  return API.graphql(graphqlOperation(createRoom, {input: newRoom}));
}

function closeAppSyncRoom(code) {
  return API.graphql(
    graphqlOperation(deleteRoom, {
      input: {id: code},
    }),
  ).catch(r => {
    console.info(r);
    console.warn('Unable to delete room ' + code);
  });
}

function updateRoomState(code, state) {
  return API.graphql(
    graphqlOperation(updateRoom, {
      input: {id: code, state: state},
    }),
  ).catch(r => {
    console.info(r);
    console.warn('Unable to update room ' + code + 'with state ' + state);
  });
}

function updateRoomWinner(code, winner) {
  return API.graphql(
    graphqlOperation(updateRoom, {
      input: {id: code, winner: winner, state: 'result'},
    }),
  ).catch(r => {
    console.info(r);
    console.warn('Unable to update room ' + code + 'with winner ' + winner);
  });
}

// ------------------------------------------------
// ---------------- VOTE OPERATIONS ---------------
// ------------------------------------------------

function submitBallot(room_id, rankings) {
  return API.graphql(
    graphqlOperation(createVote, {
      input: {room_id: room_id, ranking: rankings},
    }),
  ).catch(r => {
    console.info(r);
    console.warn(
      'Unable to create vote record for room: ' +
        room_id +
        ' with rankings: ' +
        rankings,
    );
  });
}

function getAllBallots(room_id) {
  return API.graphql(
    graphqlOperation(getVotesForRoom, {
      room_id: room_id,
    }),
  ).catch(r => {
    console.info(r);
    console.warn('Unable to fetch votes for room ' + room_id);
  });
}

function deleteAllBallots(room_id) {
  getAllBallots(room_id)
    .then(r => {
      const voteIds = r.data.getVotesForRoom.items ?? [];
      if (voteIds.length > 0) {
        return API.graphql(
          graphqlOperation(deleteVotes, {
            input: {ids: voteIds.map(a => a.id)},
          }),
        );
      }
    })
    .catch(r => {
      console.info(r);
      console.warn('Unable to delete votes for room ' + room_id);
    });
}

export {
  appSyncRoomExists,
  getAppSyncRoom,
  createAppSyncRoom,
  closeAppSyncRoom,
  updateRoomState,
  updateRoomWinner,
  submitBallot,
  getAllBallots,
  deleteAllBallots,
  addRoomUser,
  removeRoomUser,
  updateRoomUserState,
  getAllUsersForRoom,
};
