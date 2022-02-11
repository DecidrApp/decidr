import { combineReducers, createStore } from "redux";

import hostReducer from './reducers/hostReducer';

const rootReducer = combineReducers({host: hostReducer});

export default createStore(rootReducer);
