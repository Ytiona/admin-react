import { getWrap as get, postWrap as post } from './utils';

// 菜单管理
export const getMenuList = get('/sys/getMenuList');
export const addNode = post('/sys/addNode');
export const updateNode = post('/sys/updateNode');
export const batchDeleteNode = post('/sys/batchDeleteNode');

// 角色管理
export const getRoleList = get('/sys/getRoleList');
export const getRoleListByPage = get('/sys/getRoleListByPage');
export const addRole = post('/sys/addRole');
export const batchDeleteRole = post('/sys/batchDeleteRole');
export const updateRole = post('/sys/updateRole');
export const roleMenuAuth = post('/sys/roleMenuAuth');
export const getRoleMenu = get('/sys/getRoleMenu');
export const roleApiAuth = post('/sys/roleApiAuth');
export const updateDefaultRole = post('/sys/updateDefaultRole');

// 接口管理
export const getApiList = get('/sys/getApiList');
export const getAuthApiList = get('/sys/getAuthApiList');

// 用户管理
export const getUserList = get('/sys/getUserList');
export const createUser = post('/sys/createUser');
export const updateUser = post('/sys/updateUser');
export const deleteUser = post('/sys/deleteUser');
export const disableUser = post('/sys/disableUser');

// 字典管理
export const addDict = post('/sys/addDict');
export const getDictList = get('/sys/getDictList');
export const deleteDict = post('/sys/deleteDict');
export const updateDict = post('/sys/updateDict');

export const addDictItem = post('/sys/addDictItem');
export const getDictItems = get('/sys/getDictItems');
export const deleteDictItems = post('/sys/deleteDictItems');
export const updateDictItem = post('/sys/updateDictItem');
