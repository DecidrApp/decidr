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
    default:
      return state;
  }
};

export default hostReducer;
