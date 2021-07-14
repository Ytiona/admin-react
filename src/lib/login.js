import store from '@/store';

store.dispatch({ type: 'setToken', data: window.lStore.get('token') });

store.dispatch({ type: 'setUserInfo', data: window.lStore.get('userInfo') });