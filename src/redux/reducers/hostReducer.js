const initialState = {
  isHost: false,
};

const hostReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_HOST':
      return {
        ...state,
        isHost: action.payload,
      };
    case 'SET_LOCATION':
      return {
        ...state,
        granted: action.payload.granted,
        longitude: action.payload.longitude,
        latitude: action.payload.latitude,
      };
    default:
      return state;
  }
};

export default hostReducer;
