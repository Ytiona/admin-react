import { 
  getWrap as get, 
  postWrap as post
} from './utils';

export const getMenuList = get('/sys/getMenuList');

export const addNode = post('/sys/addNode');

export const updateNode = post('/sys/updateNode');

export const batchDeleteNode = post('/sys/batchDeleteNode');