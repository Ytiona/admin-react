import { getWrap as get, postWrap as post, uploadWrap as upload } from './utils';

export const login = post('/user/login')