import { Map } from 'immutable';

const defaultState = Map({
  userInfo: {}
})

function reducer(state = defaultState, action) {
  switch(action.type) {
    case 'setUserInfo': 
      return state.set('userInfo', action.data);
    default:
      return state;
  }
}

export default reducer;