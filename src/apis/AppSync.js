import {API, graphqlOperation} from 'aws-amplify';
import {getRoom, getVotesForRoom} from '../graphql/queries';
import {
  createRoom,
  createVote,
  deleteVotes,
  deleteRoom,
  updateRoom,
} from '../graphql/mutations';

// ------------------------------------------------
// ---------------- HELPER FUNCTIONS --------------
// ------------------------------------------------

function generateCode() {
  return Math.random()
    .toString(36)
    .replace(/[^a-np-z1-9]+/, '')
    .slice(0, 5);
}

// ------------------------------------------------
// ---------------- ROOM OPERATIONS ---------------
// ------------------------------------------------

async function appSyncRoomExists(code) {
  return API.graphql(graphqlOperation(getRoom, {id: code}))
    .then(r => {
      return !!r?.data?.getRoom;
    })
    .catch(r => {
      return false;
    });
}

async function getAppSyncRoom(code) {
  return API.graphql(graphqlOperation(getRoom, {id: code})).catch(r => {
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
      input: {id: code, winner: winner},
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
      return API.graphql(
        graphqlOperation(deleteVotes, {
          input: {ids: r.data.getVotesForRoom.items.map(a => a.id)},
        }),
      );
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
};
