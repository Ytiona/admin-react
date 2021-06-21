import { combineReducers } from 'redux-immutable';

import userReducer from './user';

const cReducer = combineReducers({
  user: userReducer
});


export default cReducer;
