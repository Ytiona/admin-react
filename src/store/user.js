import { Map } from 'immutable';

const initState = Map({
  token: '',
  userInfo: {},
  menuList: []
})

function reducer(state = initState, { type, data }) {
  switch (type) {
    case 'setUserInfo':
      window.lStore.set('userInfo', data);
      return state.set('userInfo', data);
    case 'setToken':
      window.lStore.set('token', data);
      return state.set('token', data);
    case 'setUserMenuList':
      window.lStore.set('menuList', data);
      return state.set('menuList', data);
    case 'logout':
      window.lStore.remove('token');
      window.lStore.remove('menuList');
      window.lStore.remove('userInfo');
      return state.set('menuList', []).set('token', '');
    default:
      return state;
  }
}

export default reducer;