import store from '@/store';

const token = window.lStore.get('token');

if(token) {
  store.dispatch({ type: 'setToken', data: token });
}