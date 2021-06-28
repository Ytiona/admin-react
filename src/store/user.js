import { Map } from 'immutable';

const defaultState = Map({
  token: '',
  userInfo: {},
  menuList: []
})

function reducer(state = defaultState, { type, data }) {
  switch(type) {
    case 'setUserInfo': 
      return state.set('userInfo', data);
    case 'setToken':
      window.lStore.set('token', data);
      return state.set('token', data);
    case 'setMenuList':
      window.lStore.set('menuList', data);
      return state.set('menuList', data);
    case 'logout':
      window.lStore.remove('token');
      window.lStore.remove('menuList');
      return state.set('menuList', []).set('token', '');
    default:
      return state;
  }
}

export default reducer;