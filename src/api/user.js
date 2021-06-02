import { getWrap as get, postWrap as post } from './utils';

export const login = post('/user/login');

export const getTest = get('/');