import { Map } from 'immutable';

const defaultState = Map({
  token: '',
  userInfo: {}
})

function reducer(state = defaultState, { type, data }) {
  switch(type) {
    case 'setUserInfo': 
      return state.set('userInfo', data);
    case 'setToken':
      localStorage.setItem('token', data);
      return state.set('token', data);
    default:
      return state;
  }
}

export default reducer;