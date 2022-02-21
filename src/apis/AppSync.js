import {API, graphqlOperation} from 'aws-amplify';
import {getRoom} from '../graphql/queries';
import {createRoom, createVote, deleteRoom} from '../graphql/mutations';

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
  ).catch(() => {
    console.warn('Unable to delete room');
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
    console.warn('Unable to create vote');
  });
}

export {
  appSyncRoomExists,
  getAppSyncRoom,
  createAppSyncRoom,
  closeAppSyncRoom,
  submitBallot,
};
