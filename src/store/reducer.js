import { combineReducers } from 'redux-immutable';

import userReducer from './user';
import systemReduceer from './system';

const cReducer = combineReducers({
  user: userReducer,
  system: systemReduceer
});


export default cReducer;
