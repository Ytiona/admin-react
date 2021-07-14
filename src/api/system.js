import { 
  getWrap as get, 
  postWrap as post
} from './utils';

export const getMenuList = get('/sys/getMenuList');

export const addNode = post('/sys/addNode');

export const updateNode = post('/sys/updateNode');

export const batchDeleteNode = post('/sys/batchDeleteNode');

export const getRoleList = get('/sys/getRoleList');

export const addRole = post('/sys/addRole');

export const batchDeleteRole = post('/sys/batchDeleteRole');

export const updateRole = post('/sys/updateRole');

export const roleMenuAuth = post('/sys/roleMenuAuth');

export const getRoleMenu = get('/sys/getRoleMenu');

export const getApiList = get('/sys/getApiList');