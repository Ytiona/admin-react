import { Map } from "immutable";

const initState = Map({
  menuList: []
})

function reducer(state = initState, { type, data }) {
  switch (type) {
    case 'setSystemMenuList':
      return state.set('menuList', data);
    default:
      return state;
  }
}

export default reducer;