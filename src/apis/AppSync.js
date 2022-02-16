import {API, graphqlOperation} from 'aws-amplify';
import {getRoom} from '../graphql/queries';
import {createRoom, deleteRoom} from '../graphql/mutations';

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

const generateCode = () => {
  return Math.random()
    .toString(36)
    .replace(/[^a-np-z1-9]+/, '')
    .slice(0, 5);
};

async function createAppSyncRoom() {
  let code = generateCode();

  await appSyncRoomExists(code).then(r => {
    if (r) {
      code = generateCode();
    }
  });

  const newRoom = {
    code: code,
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

export {appSyncRoomExists, getAppSyncRoom, createAppSyncRoom, closeAppSyncRoom};
