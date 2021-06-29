import { 
  getWrap as get, 
  postWrap as post, 
  // uploadWrap as upload 
} from './utils';

export const login = post('/user/login');

export const getTest = get('/user/get');

export const getUserMenuList = get('/user/getUserMenuList');