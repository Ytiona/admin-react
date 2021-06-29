import { 
  getWrap as get, 
  postWrap as post
} from './utils';

export const getMenuList = get('/sys/getMenuList', {}, {
  cancel: true
})

export const addNode = post('/sys/addNode');